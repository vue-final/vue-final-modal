import { isString, tryOnUnmounted } from '@vueuse/core'
import { computed, inject, markRaw, reactive, useAttrs } from 'vue'
import type { Component } from 'vue'
import VueFinalModal from './components/VueFinalModal/VueFinalModal.vue'
import type CoreModal from './components/CoreModal/CoreModal.vue'
import { internalVfmSymbol, vfmSymbol } from './injectionSymbols'

import type { ComponentProps, IOverloadedUseModalFn, InternalVfm, ModalSlot, ModalSlotOptions, UseModalOptions, UseModalOptionsPrivate, UseModalReturnType, Vfm } from './Modal'

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

function withMarkRaw(options: Partial<UseModalOptions>, DefaultComponent: Component = VueFinalModal) {
  const { component, slots: innerSlots, ...rest } = options

  const slots = typeof innerSlots === 'undefined'
    ? {}
    : Object.fromEntries<ModalSlot>(Object.entries(innerSlots).map(([name, maybeComponent]) => {
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
    component: markRaw(component || DefaultComponent),
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

  function patchAttrs<T extends Record<string, any>>(attrs: T, newAttrs: Partial<T>): T {
    Object.entries(newAttrs).forEach(([key, value]) => {
      attrs[key as keyof T] = value
    })

    return attrs
  }

  function isModalSlotOptions(value: any): value is ModalSlotOptions {
    return 'component' in value || 'attrs' in value
  }

  function patchOptions(_options: Partial<UseModalOptions>) {
    const { slots, ...rest } = withMarkRaw(_options, options.component)

    if (rest.component)
      options.component = rest.component

    if (rest.attrs)
      patchAttrs(options.attrs!, rest.attrs)

    slots && Object.entries(slots).forEach(([name, slot]) => {
      const oldSlot = options.slots![name]
      if (isModalSlotOptions(oldSlot) && isModalSlotOptions(slot)) {
        if (slot.component)
          (oldSlot.component = slot.component)

        if (slot.attrs)
          patchAttrs(oldSlot.attrs!, slot.attrs)

        return
      }

      options.slots![name] = slot
    })
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
