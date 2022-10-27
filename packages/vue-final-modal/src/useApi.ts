import { inject, onUnmounted, reactive } from 'vue'
import { internalVfmSymbol, vfmSymbol } from './injectionSymbols'
import type { ComponentProps, InternalVfm, UseModalOptions, UseModalOptionsPrivate, UseModalReturnType, Vfm } from './Modal'

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

/**
 * Create a dynamic modal.
 */
export function useModal<
    ModalProps extends ComponentProps,
    DefaultSlotProps extends ComponentProps = {},
  >(_options?: UseModalOptions<ModalProps, DefaultSlotProps>): UseModalReturnType<ModalProps, DefaultSlotProps> {
  const { dynamicModals } = useVfm()

  const options = reactive({
    id: Symbol('useModal'),
    modelValue: false,
    ..._options,
  }) as UseModalOptionsPrivate<ModalProps, DefaultSlotProps>

  dynamicModals.push(options)

  onUnmounted(() => {
    const index = dynamicModals.indexOf(options)
    if (index !== -1)
      dynamicModals.splice(index, 1)
  })

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

  function patchOptions(_options: UseModalOptions<ModalProps, DefaultSlotProps>) {
    Object.assign(options?.attrs || {}, _options?.attrs || {})
    Object.assign(options?.component || {}, _options?.component || {})
    Object.assign(options?.slots || {}, _options?.slots || {})
  }

  return {
    options,
    open,
    close,
    patchOptions,
  }
}
