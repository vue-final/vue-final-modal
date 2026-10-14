import type { Component } from 'vue'
import type { Template, TemplateAttrs, UseTemplate } from 'vue-use-template'
import type { ResolvedTemplate } from '../components/UseModal'
import type { VfmInternal } from '../plugin'
import type { ModalCloseResult, ModalOpenResult, ModalStatus, UseModalOptions, UseModalReturnType, Vfm } from '../types'
import type { Pending } from '../utils'
import { tryOnUnmounted } from '@vueuse/core'
import { computed, getCurrentInstance, hasInjectionContext, inject, nextTick, readonly, ref, ssrContextKey, toValue, unref, warn } from 'vue'
import { createUseTemplate, isBrowser } from 'vue-use-template'
import { UseModal } from '../components/UseModal'
import VueFinalModal from '../components/VueFinalModal.vue'
import { vfmSymbol } from '../injectionSymbols'
import { missingVfmError, vfmResolver } from '../plugin'
import { createPending } from '../utils'

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
  const status = ref<ModalStatus>('closed')
  /** Shared by every open() asked for while the modal opens, and every close() while it closes. */
  let opening: Pending<ModalOpenResult> | undefined
  let closing: Pending<ModalCloseResult> | undefined

  /** A close() requested while the modal was still opening: applied once it has opened, so the modal mounts open and both lifecycles complete. */
  let closeOnceOpened = false

  function settleOpen(result: ModalOpenResult) {
    const settled = opening
    opening = undefined
    settled?.resolve(result)
  }

  function settleClose(result: ModalCloseResult) {
    const settled = closing
    closing = undefined
    settled?.resolve(result)
  }

  function joinOpen() {
    opening ??= createPending()
    return opening.promise
  }

  function joinClose() {
    closing ??= createPending()
    return closing.promise
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
        settleClose('toggled-again')
      }
    },
    onClosed() {
      /** Closed before it finished opening, by Esc, a click outside or anything else than close(). */
      settleOpen('toggled-again')
      settleClose('closed')
      status.value = 'closed'
      closeOnceOpened = false
      if (!options.keepAlive)
        detach()
    },
    onStopped(opening: boolean) {
      if (!opening) {
        settleClose('stopped')
        status.value = 'opened'
        return
      }
      settleOpen('stopped')
      status.value = 'closed'
      /** A close() requested while it was opening finds the modal closed already. */
      if (closeOnceOpened)
        settleClose('closed')
      closeOnceOpened = false
      if (!options.keepAlive)
        detach()
    },
    onStatus(next: ModalStatus) {
      /** No transition runs during a server render, so the component never gets past opening there. */
      if (!createdInServerRender)
        status.value = next
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
    if (modelValue.value && createdInServerRender)
      status.value = 'opened'
  }

  tryOnUnmounted(() => {
    if (!options.keepAlive)
      destroy()
  })

  async function open(): Promise<ModalOpenResult> {
    if (modelValue.value) {
      if (closeOnceOpened) {
        closeOnceOpened = false
        settleClose('toggled-again')
      }
      /** Still opening, or not even asked beforeOpen yet: the component reports opening once beforeOpen let it. */
      return status.value === 'opened' ? 'already-opened' : joinOpen()
    }

    let vfm = resolveVfm()
    if (!vfm) {
      await nextTick()
      vfm = resolveVfm()
    }
    if (!vfm && !isBrowser()) {
      /** Concurrent requests share every module-level variable, so the server never guesses which request's vfm to use. */
      warn('[Vue Final Modal]: open() is ignored on the server because the modal was created outside a component and opened outside any app context. Call useModal() in setup() to open it during a server render.')
      return 'skipped-on-server'
    }
    if (!vfm)
      throw missingVfmError()
    if (!attach(vfm))
      return 'skipped-on-server'

    modelValue.value = true

    /** Nothing would ever report the modal as opened during a server render: no transition runs there, and a modal shown after ModalsContainer rendered is not rendered at all. */
    if (createdInServerRender) {
      status.value = 'opened'
      return 'opened'
    }

    settleOpen('toggled-again')
    return joinOpen()
  }

  function close(): Promise<ModalCloseResult> {
    if (!modelValue.value)
      return status.value === 'closed' ? Promise.resolve('already-closed') : joinClose()

    if (createdInServerRender) {
      modelValue.value = false
      status.value = 'closed'
      detach()
      return Promise.resolve('closed')
    }

    if (closeOnceOpened)
      return joinClose()

    if (opening)
      closeOnceOpened = true
    else
      modelValue.value = false

    settleClose('toggled-again')
    return joinClose()
  }

  function destroy(): void {
    settleOpen('destroyed')
    settleClose('destroyed')
    closeOnceOpened = false
    modelValue.value = false
    status.value = 'closed'
    detach()
  }

  return {
    open,
    close,
    destroy,
    status: readonly(status),
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
