import { computed, inject, markRaw, nextTick, reactive, useAttrs } from 'vue'
import { tryOnUnmounted } from '@vueuse/core'
import type { Component } from 'vue'
import VueFinalModal from './components/VueFinalModal/VueFinalModal.vue'
import type CoreModal from './components/CoreModal/CoreModal.vue'
import { internalVfmSymbol } from './injectionSymbols'

import type { ComponentProps, Constructor, InternalVfm, ModalSlot, ModalSlotOptions, RawProps, UseModalOptions, UseModalOptionsPrivate, UseModalReturnType, Vfm } from './Modal'
import { activeVfm, getActiveVfm } from './plugin'
import { isString } from '~/utils'

/**
 * Returns the vfm instance. Equivalent to using `$vfm` inside
 * templates.
 */
export function useVfm(): Vfm {
  const vfm = getActiveVfm()
  if (__DEV__ && !vfm) {
    throw new Error(
      '[Vue Final Modal]: getActiveVfm was called with no active Vfm. Did you forget to install vfm?\n'
        + '\tconst vfm = createVfm()\n'
        + '\tapp.use(vfm)\n'
        + 'This will fail in production.',
    )
  }

  return vfm!
}

/**
 * Returns the internalVfm instance.
 */
export function useInternalVfm(): InternalVfm {
  return inject(internalVfmSymbol)!
}

function withMarkRaw<P>(options: Partial<UseModalOptions<P>>, DefaultComponent: Component = VueFinalModal) {
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
    component: markRaw(component || DefaultComponent) as Constructor<P>,
    slots,
  }
}

/**
 * Create a dynamic modal.
 */
export function useModal<P = InstanceType<typeof VueFinalModal>['$props']>(_options: UseModalOptions<P>): UseModalReturnType<P> {
  const options = reactive({
    id: Symbol('useModal'),
    modelValue: !!_options?.defaultModelValue,
    resolveOpened: () => { },
    resolveClosed: () => { },
    attrs: {},
    ...withMarkRaw<P>(_options),
  }) as UseModalOptions<P> & UseModalOptionsPrivate
  tryOnUnmounted(() => {
    if (!options?.keepAlive)
      destroy()
  })

  if (options.modelValue === true) {
    // nextTick will break the SSR, so use `activeVfm` first and then `useVfm()`
    if (activeVfm) {
      activeVfm?.dynamicModals.push(options)
    }
    else {
      nextTick(() => {
        const vfm = useVfm()
        vfm?.dynamicModals.push(options)
      })
    }
  }

  async function open(): Promise<string> {
    // nextTick will break the SSR, so use `activeVfm` first and then `useVfm()`
    let vfm: Vfm
    if (activeVfm) {
      vfm = activeVfm
    }
    else {
      await nextTick()
      vfm = useVfm()
    }
    if (options.modelValue)
      return Promise.resolve('[Vue Final Modal] modal is already opened.')

    destroy()
    options.modelValue = true
    vfm.dynamicModals.push(options)

    return new Promise((resolve) => {
      options.resolveOpened = () => resolve('opened')
    })
  }

  function close(): Promise<string> {
    if (!options.modelValue)
      return Promise.resolve('[Vue Final Modal] modal is already closed.')

    options.modelValue = false
    return new Promise((resolve) => {
      options.resolveClosed = () => resolve('closed')
    })
  }

  function patchOptions(_options: Partial<UseModalOptions<P>>) {
    const { slots, ...rest } = withMarkRaw(_options, options.component)

    if (_options.defaultModelValue !== undefined)
      options.defaultModelValue = _options.defaultModelValue
    if (_options?.keepAlive !== undefined)
      options.keepAlive = _options?.keepAlive

    // patch options.component and options.attrs
    patchComponentOptions(options, rest)

    // patch options.slots
    if (slots) {
      Object.entries(slots).forEach(([name, slot]) => {
        const originSlot = options.slots![name]
        if (isString(originSlot))
          options.slots![name] = slot
        else if (isModalSlotOptions(originSlot) && isModalSlotOptions(slot))
          patchComponentOptions(originSlot, slot)
        else
          options.slots![name] = slot
      })
    }
  }

  function patchComponentOptions<P>(
    options: UseModalOptions<P> | ModalSlotOptions,
    newOptions: Partial<UseModalOptions<P>> | ModalSlotOptions,
  ) {
    if (newOptions.component)
      options.component = newOptions.component

    if (newOptions.attrs)
      patchAttrs(options.attrs!, newOptions.attrs)
  }

  function patchAttrs<T extends Record<string, any>>(attrs: T, newAttrs: Partial<T>): T {
    Object.entries(newAttrs).forEach(([key, value]) => {
      attrs[key as keyof T] = value as any
    })

    return attrs
  }

  function destroy(): void {
    const vfm = useVfm()
    const index = vfm.dynamicModals.indexOf(options)
    if (index !== -1)
      vfm.dynamicModals.splice(index, 1)
  }

  return {
    options,
    open,
    close,
    patchOptions,
    destroy,
  }
}

export function useModalSlot<P>(options: {
  component: Constructor<P>
  attrs?: (RawProps & P) | ({} extends P ? null : never)
}) {
  return options
}

function isModalSlotOptions(value: any): value is ModalSlotOptions {
  return 'component' in value || 'attrs' in value
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
