import type { Component } from 'vue'
import type { Template, TemplateAttrs, UseTemplate } from 'vue-use-template'
import type { ResolvedTemplate } from '../components/UseModal'
import type { VfmInternal } from '../plugin'
import type { UseModalOptions, UseModalReturnType, Vfm } from '../types'
import { tryOnUnmounted } from '@vueuse/core'
import { computed, getCurrentInstance, hasInjectionContext, inject, nextTick, ref, ssrContextKey, toValue, unref, warn } from 'vue'
import { createUseTemplate, isBrowser } from 'vue-use-template'
import { UseModal } from '../components/UseModal'
import VueFinalModal from '../components/VueFinalModal.vue'
import { vfmSymbol } from '../injectionSymbols'
import { missingVfmError, vfmResolver } from '../plugin'
import { ALREADY_CLOSED, ALREADY_OPENED, CLOSE_STOPPED, DESTROYED, noop, OPEN_STOPPED, TOGGLED_AGAIN } from '../utils'

/**
 * Create a dynamic modal.
 */
export function useModal<T extends Component = typeof VueFinalModal, K extends keyof TemplateAttrs<T> = never>(options: UseModalOptions<T, K>): UseModalReturnType {
  /** Only an injected vfm is captured: outside setup the plugin may not be installed yet, so it is resolved when the modal opens. */
  const injectedVfm = hasInjectionContext() ? inject(vfmSymbol, undefined) : undefined
  return useModalImpl(options as UseModalOptions<T>, () => injectedVfm ?? vfmResolver.resolve())
}

export function useModalImpl<T extends Component>(options: UseModalOptions<T>, resolveVfm: () => Vfm | undefined): UseModalReturnType {
  const createdInServerRender = hasInjectionContext() && inject(ssrContextKey, null) !== null
  /** A modal created outside a component may outlive the request, and its open state with it: the server never renders it. */
  const ssr = !!getCurrentInstance()
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
      ...toValue(options.attrs),
    },
    props: options.props,
    emits: options.emits,
    slots: unrefSlots(options.slots),
  }) as ResolvedTemplate)

  /** Defined once, so a re-render of the container hands every other open modal the same listeners and skips it. */
  const listeners = {
    'onUpdate:modelValue': (value: boolean) => {
      modelValue.value = value
    },
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
    onStopped(opening: boolean) {
      if (!opening) {
        settleClose(CLOSE_STOPPED)
        return
      }
      settleOpen(OPEN_STOPPED)
      /** A close() requested while it was opening finds the modal closed already. */
      if (closeOnceOpened)
        settleClose('closed')
      closeOnceOpened = false
      if (!options.keepAlive)
        detach()
    },
  }

  const modalTemplate = {
    component: UseModal,
    attrs: () => ({ modelValue: modelValue.value, template: template.value, ...listeners }),
  }

  function attach(vfm: Vfm): boolean {
    if (!shown || shownIn !== vfm) {
      shown?.hide()
      shown = createUseTemplate((vfm as VfmInternal)._templates)(modalTemplate, { hideOnUnmounted: false, ssr })
      shownIn = vfm
    }
    if (shown.ignored) {
      /** Checked before show(), whose own warning names useTemplate(), which vfm users never call. */
      warn('[Vue Final Modal]: a modal created or opened outside a component is skipped on the server. Call useModal() and open() while a component sets up to render it on the server.')
      return false
    }
    shown.show()
    return true
  }

  function detach() {
    shown?.hide()
  }

  if (modelValue.value) {
    const vfm = resolveVfm()
    if (!vfm) {
      nextTick().then(() => {
        const vfm = resolveVfm()
        if (vfm && !attach(vfm))
          modelValue.value = false
      })
    }
    else if (!attach(vfm)) {
      modelValue.value = false
    }
  }

  tryOnUnmounted(() => {
    if (!options.keepAlive)
      destroy()
  })

  async function open(): Promise<string> {
    closeOnceOpened = false
    if (modelValue.value)
      return ALREADY_OPENED

    let vfm = resolveVfm()
    if (!vfm) {
      await nextTick()
      vfm = resolveVfm()
    }
    if (!vfm && !isBrowser()) {
      /** Concurrent requests share every module-level variable, so the server never guesses which request's vfm to use. */
      warn('[Vue Final Modal]: open() is ignored on the server because the modal was created outside a component and opened outside any app context. Call useModal() in setup() to open it during a server render.')
      return '[Vue Final Modal] modal is not opened on the server outside an app context.'
    }
    if (!vfm)
      throw missingVfmError()
    if (!attach(vfm))
      return '[Vue Final Modal] modal is not opened on the server outside a component.'

    modelValue.value = true

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
      return Promise.resolve(ALREADY_CLOSED)

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
    settleOpen(DESTROYED)
    settleClose(DESTROYED)
    closeOnceOpened = false
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
export function useModalSlot<T extends Component, K extends keyof TemplateAttrs<T> = never>(template: Template<T, K>): Template<T, K> {
  return template
}

/** vue-use-template unwraps the refs given for attrs; a slot given as a ref is unwrapped here. */
function unrefSlots(slots: UseModalOptions<Component>['slots']) {
  if (!slots)
    return undefined
  return Object.fromEntries(Object.entries(slots).map(([name, slot]) => [name, unref(slot)]))
}
