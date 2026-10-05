import type { Component } from 'vue'
import { computed, hasInjectionContext, inject, nextTick, ref, toValue } from 'vue'
import { tryOnUnmounted } from '@vueuse/core'
import type { Template, UseTemplate } from 'vue-use-template'
import { createUseTemplate } from 'vue-use-template'
import VueFinalModal from '../components/VueFinalModal.vue'
import { UseModal } from '../components/UseModal'
import type { PrivateFields, UseModalOptions, UseModalReturnType, Vfm } from '../types'
import type { VfmInternal } from '../plugin'
import { vfmResolver } from '../plugin'
import { vfmSymbol } from '../injectionSymbols'
import { noop } from '../utils'

/**
 * Create a dynamic modal.
 */
export function useModal<T extends Component = typeof VueFinalModal>(options: UseModalOptions<T>): UseModalReturnType {
  /** Only an injected vfm is captured: outside setup the plugin may not be installed yet, so it is resolved when the modal opens. */
  const injectedVfm = hasInjectionContext() ? inject(vfmSymbol, undefined) : undefined
  return useModalImpl(options, () => injectedVfm ?? vfmResolver.resolve())
}

export function useModalImpl<T extends Component>(_options: UseModalOptions<T>, resolveVfm: () => Vfm | undefined): UseModalReturnType {
  const modelValue = ref(!!_options.defaultModelValue)
  let shown: ReturnType<UseTemplate> | undefined
  let shownVfm: Vfm | undefined
  let resolveOpenedPromise = noop
  let resolveClosedPromise = noop

  const privateFields = ref<PrivateFields>({
    id: Symbol('useModal'),
    resolveOpened: () => {
      resolveOpenedPromise()
      resolveOpenedPromise = noop
    },
    resolveClosed: () => {
      resolveClosedPromise()
      resolveClosedPromise = noop
      if (!_options.keepAlive)
        detach()
    },
  })

  /** Memoized so a re-render of the container hands `UseModal` the same props: a fresh template object would re-render every open modal. */
  const template = computed(() => ({
    component: (_options.component || VueFinalModal) as Component,
    attrs: {
      ...(_options.keepAlive ? { displayDirective: 'show' } : {}),
      ...(toValue(_options.attrs) ?? {}),
    },
    props: _options.props,
    emits: _options.emits,
    slots: _options.slots,
  } as Template<Component>))

  const modalTemplate = {
    component: UseModal,
    attrs: { privateFields, modelValue, template },
  }

  function templateOf(vfm: Vfm) {
    if (!shown || shownVfm !== vfm) {
      shown?.hide()
      shown = createUseTemplate((vfm as VfmInternal)._templates)(modalTemplate, { hideOnUnmounted: false })
      shownVfm = vfm
    }
    return shown
  }

  function attach(vfm: Vfm) {
    templateOf(vfm).show()
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
    if (!_options.keepAlive)
      destroy()
  })

  async function open(): Promise<string> {
    if (modelValue.value)
      return Promise.resolve('[Vue Final Modal] modal is already opened.')

    let vfm = resolveVfm()
    if (!vfm) {
      await nextTick()
      vfm = resolveVfm()
    }
    if (!vfm) {
      throw new Error(
        '[Vue Final Modal]: useModal was called with no active Vfm. Did you forget to install vfm?\n'
        + '\tconst vfm = createVfm()\n'
        + '\tapp.use(vfm)',
      )
    }

    modelValue.value = true
    attach(vfm)

    return new Promise((resolve) => {
      resolveOpenedPromise = () => resolve('opened')
    })
  }

  function close(): Promise<string> {
    if (!modelValue.value)
      return Promise.resolve('[Vue Final Modal] modal is already closed.')

    modelValue.value = false
    return new Promise((resolve) => {
      resolveClosedPromise = () => resolve('closed')
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
