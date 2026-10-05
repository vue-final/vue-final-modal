import type { Component } from 'vue'
import { getCurrentInstance, inject, nextTick, ref, toValue } from 'vue'
import { tryOnUnmounted } from '@vueuse/core'
import type { Template } from 'vue-use-template'
import { templateToVNodeFn } from 'vue-use-template'
import VueFinalModal from '../components/VueFinalModal.vue'
import { UseModal } from '../components/UseModal'
import type { PrivateFields, UseModalOptions, UseModalReturnType, Vfm } from '../types'
import { activeVfm, pushVNodeFn, removeVNodeFn } from '../plugin'
import { vfmSymbol } from '../injectionSymbols'
import { noop } from '../utils'

/**
 * Create a dynamic modal.
 */
export function useModal<T extends Component = typeof VueFinalModal>(options: UseModalOptions<T>): UseModalReturnType {
  /** `activeVfm` is resolved lazily: at creation time the plugin may not be installed yet. */
  const injectedVfm = getCurrentInstance() ? inject(vfmSymbol, undefined) : undefined
  return useModalImpl(options, () => injectedVfm || activeVfm)
}

export function useModalImpl<T extends Component>(_options: UseModalOptions<T>, resolveVfm: () => Vfm | undefined): UseModalReturnType {
  const modelValue = ref(!!_options.defaultModelValue)
  let attachedVfm: Vfm | undefined
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

  const vNodeFn = templateToVNodeFn(() => ({
    component: UseModal,
    attrs: {
      privateFields,
      modelValue,
      template: {
        component: (_options.component || VueFinalModal) as Component,
        attrs: {
          ...(_options.keepAlive ? { displayDirective: 'show' } : {}),
          ...(toValue(_options.attrs) ?? {}),
        },
        props: _options.props,
        emits: _options.emits,
        slots: _options.slots,
      } as Template<Component>,
    },
  }))

  function attach(vfm: Vfm) {
    attachedVfm = vfm
    pushVNodeFn(vfm, vNodeFn)
  }

  function detach() {
    if (attachedVfm)
      removeVNodeFn(attachedVfm, vNodeFn)
    attachedVfm = undefined
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
