import type { Component } from 'vue'
import { computed, hasInjectionContext, inject, nextTick, ref, ssrContextKey, toValue, warn } from 'vue'
import { isClient, tryOnUnmounted } from '@vueuse/core'
import type { Template, UseTemplate } from 'vue-use-template'
import { createUseTemplate } from 'vue-use-template'
import VueFinalModal from '../components/VueFinalModal.vue'
import { UseModal } from '../components/UseModal'
import type { UseModalOptions, UseModalReturnType, Vfm } from '../types'
import type { VfmInternal } from '../plugin'
import { missingVfmError, vfmResolver } from '../plugin'
import { vfmSymbol } from '../injectionSymbols'
import { TOGGLED_AGAIN, noop } from '../utils'

/**
 * Create a dynamic modal.
 */
export function useModal<T extends Component = typeof VueFinalModal>(options: UseModalOptions<T>): UseModalReturnType {
  /** Only an injected vfm is captured: outside setup the plugin may not be installed yet, so it is resolved when the modal opens. */
  const injectedVfm = hasInjectionContext() ? inject(vfmSymbol, undefined) : undefined
  return useModalImpl(options, () => injectedVfm ?? vfmResolver.resolve())
}

export function useModalImpl<T extends Component>(options: UseModalOptions<T>, resolveVfm: () => Vfm | undefined): UseModalReturnType {
  const createdInServerRender = hasInjectionContext() && inject(ssrContextKey, null) !== null
  const modelValue = ref(!!options.defaultModelValue)
  let shown: ReturnType<UseTemplate> | undefined
  let shownIn: Vfm | undefined
  let resolveOpened: (result: string) => void = noop
  let resolveClosed: (result: string) => void = noop

  /** A close() requested while the modal was still opening: applied once it has opened, so the modal mounts open and both lifecycles complete. */
  let closeOnceOpened = false

  function settleOpen(result: string) {
    resolveOpened(result)
    resolveOpened = noop
  }

  function settleClose(result: string) {
    resolveClosed(result)
    resolveClosed = noop
  }

  /** Memoized so a re-render of the container hands `UseModal` the same props: a fresh template object would re-render every open modal. */
  const template = computed(() => ({
    component: (options.component || VueFinalModal) as Component,
    attrs: {
      ...(options.keepAlive ? { displayDirective: 'show' } : {}),
      ...(toValue(options.attrs) ?? {}),
    },
    props: options.props,
    emits: options.emits,
    slots: options.slots,
  } as Template<Component>))

  const modalTemplate = {
    component: UseModal,
    attrs: {
      modelValue,
      template,
      onOpened() {
        settleOpen('opened')
        if (closeOnceOpened) {
          closeOnceOpened = false
          modelValue.value = false
        }
        else {
          /** Opened again while it was closing: that close() never sees the modal closed. */
          settleClose(TOGGLED_AGAIN)
        }
      },
      onClosed() {
        /** Closed before it finished opening, by Esc, a click outside or anything else than close(). */
        settleOpen(TOGGLED_AGAIN)
        settleClose('closed')
        closeOnceOpened = false
        if (!options.keepAlive)
          detach()
      },
    },
  }

  function attach(vfm: Vfm) {
    if (shownIn !== vfm) {
      shown?.hide()
      shown = createUseTemplate((vfm as VfmInternal)._templates)(modalTemplate, { hideOnUnmounted: false })
      shownIn = vfm
    }
    shown?.show()
  }

  function detach() {
    shown?.hide()
  }

  if (modelValue.value) {
    const vfm = resolveVfm()
    if (vfm) {
      attach(vfm)
    }
    else {
      nextTick().then(() => {
        const vfm = resolveVfm()
        if (vfm)
          attach(vfm)
      })
    }
  }

  tryOnUnmounted(() => {
    if (!options.keepAlive)
      destroy()
  })

  async function open(): Promise<string> {
    closeOnceOpened = false
    if (modelValue.value)
      return '[Vue Final Modal] modal is already opened.'

    let vfm = resolveVfm()
    if (!vfm) {
      await nextTick()
      vfm = resolveVfm()
    }
    if (!vfm && !isClient) {
      /** Concurrent requests share every module-level variable, so the server never guesses which request's vfm to use. */
      warn('[Vue Final Modal]: open() is ignored on the server because the modal was created outside a component and opened outside any app context. Call useModal() in setup() to open it during a server render.')
      return '[Vue Final Modal] modal is not opened on the server outside an app context.'
    }
    if (!vfm)
      throw missingVfmError()

    modelValue.value = true
    attach(vfm)

    /** Nothing would ever report the modal as opened during a server render: no transition runs there, and a modal shown after ModalsContainer rendered is not rendered at all. */
    if (createdInServerRender)
      return 'opened'

    settleOpen(TOGGLED_AGAIN)
    return new Promise((resolve) => {
      resolveOpened = resolve
    })
  }

  function close(): Promise<string> {
    if (!modelValue.value)
      return Promise.resolve('[Vue Final Modal] modal is already closed.')

    if (createdInServerRender) {
      modelValue.value = false
      detach()
      return Promise.resolve('closed')
    }

    if (resolveOpened === noop)
      modelValue.value = false
    else
      closeOnceOpened = true

    settleClose(TOGGLED_AGAIN)
    return new Promise((resolve) => {
      resolveClosed = resolve
    })
  }

  function destroy(): void {
    modelValue.value = false
    detach()
  }

  return {
    open,
    close,
    destroy,
  }
}

/**
 * A type helper for a component with attrs inside the `slots` option of `useModal()`.
 */
export function useModalSlot<T extends Component>(template: Template<T>): Template<T> {
  return template
}
