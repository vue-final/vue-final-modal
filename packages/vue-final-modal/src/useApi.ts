import { isString, tryOnUnmounted } from '@vueuse/core'
import { computed, inject, markRaw, reactive, useAttrs } from 'vue'
import VueFinalModal from './components/VueFinalModal/VueFinalModal.vue'
import type CoreModal from './components/CoreModal/CoreModal.vue'
import { internalVfmSymbol, vfmSymbol } from './injectionSymbols'
import type { ComponentProps, IOverloadedUseModalFn, InternalVfm, UseModalOptions, UseModalOptionsPrivate, UseModalOptionsSlots, UseModalReturnType, Vfm } from './Modal'

/**
 * Returns the vfm instance. Equivalent to using `$vfm` inside
 * templates.
 */
export function useVfm(): Vfm {
  return inject(vfmSymbol)!
}

/**
 * Returns the internalVfm instance.
 */
export function useInternalVfm(): InternalVfm {
  return inject(internalVfmSymbol)!
}

function withMarkRaw(options: Partial<UseModalOptions>) {
  const { component, slots: innerSlots, ...rest } = options

  const slots = typeof innerSlots === 'undefined'
    ? {}
    : Object.fromEntries<UseModalOptionsSlots['slots']>(Object.entries(innerSlots).map(([name, maybeComponent]) => {
      if (isString(maybeComponent))
        return [name, maybeComponent] as const

      if ('component' in maybeComponent) {
        return [name, {
          ...maybeComponent,
          component: markRaw(maybeComponent.component),
        }]
      }

      return [name, markRaw(maybeComponent)]
    }))

  return {
    ...rest,
    component: markRaw(component || VueFinalModal),
    slots,
  }
}

/**
 * Create a dynamic modal.
 */
export const useModal: IOverloadedUseModalFn = function (_options: UseModalOptions): UseModalReturnType {
  const options = reactive({
    id: Symbol('useModal'),
    modelValue: !!_options?.defaultModelValue,
    resolveOpened: () => {},
    resolveClosed: () => {},
    attrs: {},
    ...withMarkRaw(_options),
  }) as UseModalOptions & UseModalOptionsPrivate

  if (!options.context)
    options.context = useVfm()

  function open(): Promise<string> {
    if (options.modelValue)
      return Promise.resolve('[Vue Final Modal] modal is already opened')

    options.modelValue = true
    return new Promise((resolve) => {
      options.resolveOpened = () => resolve('opened')
    })
  }

  function close(): Promise<string> {
    if (!options.modelValue)
      return Promise.resolve('[Vue Final Modal] modal is already closed')

    options.modelValue = false
    return new Promise((resolve) => {
      options.resolveClosed = () => resolve('closed')
    })
  }

  function patchOptions(_options: Partial<UseModalOptions>) {
    const _patchOptions = withMarkRaw(_options)
    if (_patchOptions?.attrs)
      Object.assign(options.attrs || {}, _patchOptions.attrs)
    if (_patchOptions?.component)
      Object.assign(options.component || {}, _patchOptions.component)
    if (_patchOptions?.slots)
      Object.assign(options.slots || {}, _patchOptions.slots)
  }

  function destroy(): void {
    if (!options.context)
      return
    const index = options.context.dynamicModals.indexOf(options)
    if (index !== -1)
      options.context.dynamicModals.splice(index, 1)
  }

  const modal = {
    options,
    open,
    close,
    patchOptions,
    destroy,
  }

  modal.options.context?.dynamicModals.push(modal.options)

  tryOnUnmounted(() => modal.destroy())

  return modal
}

export function pickModalProps(props: any, modalProps: any) {
  return Object.keys(modalProps).reduce((acc, propName) => {
    acc[propName] = props[propName]
    return acc
  }, {} as Record<string, any>)
}

export function byPassAllModalEvents(emit?: InstanceType<typeof CoreModal>['$emit']) {
  if (!emit)
    return {}
  return {
    'onUpdate:modelValue': (val: boolean) => emit('update:modelValue', val),

    'onBeforeClose': () => emit('beforeClose'),
    'onClosed': () => emit('closed'),
    'onBeforeOpen': () => emit('beforeOpen'),
    'onOpened': () => emit('opened'),

    /** onClickOutside will only be emitted when clickToClose equal to `false` */
    'onClickOutside': () => emit('clickOutside'),
  }
}

export function useVfmAttrs(options: {
  props: ComponentProps
  modalProps: ComponentProps
  emit?: any
}) {
  const { props, modalProps, emit } = options
  const bindProps = computed(() => pickModalProps(props, modalProps))
  const bindEmits = byPassAllModalEvents(emit)
  const attrs = useAttrs()
  const vfmAttrs = computed(() => ({
    ...bindProps.value,
    ...bindEmits,
    ...attrs,
  }))

  return vfmAttrs
}
