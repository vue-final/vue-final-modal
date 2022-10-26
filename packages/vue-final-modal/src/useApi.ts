import { inject, reactive } from 'vue'
import { vfmSymbol } from './injectionSymbols'
import type { ComponentProps, UseModalOptions, UseModalOptionsPrivate, UseModalReturnType, Vfm } from './Modal'

/**
 * Returns the vfm instance. Equivalent to using `$vfm` inside
 * templates.
 */
export function useVfm(): Vfm {
  return inject(vfmSymbol)!
}

export function useModal<
    ModalProps extends ComponentProps,
    DefaultSlotProps extends ComponentProps = ComponentProps,
  >(_options?: UseModalOptions<ModalProps, DefaultSlotProps>): UseModalReturnType<ModalProps, DefaultSlotProps> {
  const { dynamicModals } = useVfm()

  function existModal<ModalProps extends ComponentProps, DefaultSlotProps extends ComponentProps>(options: UseModalOptionsPrivate<ModalProps, DefaultSlotProps>) {
    return dynamicModals.includes(options)
  }

  const options = reactive({
    id: Symbol('useModal'),
    modelValue: false,
    ..._options,
  }) as UseModalOptionsPrivate<ModalProps, DefaultSlotProps>

  const open = () => {
    options.modelValue = true
    return existModal(options)
      ? Promise.resolve('[Vue Final Modal] modal is already opened')
      : new Promise((resolve) => {
        options.resolveOpened = () => resolve('opened')
        dynamicModals.push(options)
      })
  }

  const close = () => {
    options.modelValue = false
    return existModal(options)
      ? new Promise((resolve) => {
        options.resolveClosed = () => resolve('closed')
      })
      : Promise.resolve('[Vue Final Modal] modal is already closed')
  }

  const mergeOptions = (_options: UseModalOptions<ModalProps, DefaultSlotProps>) => {
    Object.assign(options?.attrs || {}, _options?.attrs || {})
    Object.assign(options?.component || {}, _options?.component || {})
    Object.assign(options?.slots || {}, _options?.slots || {})
  }

  return {
    open,
    close,
    options,
    mergeOptions,
  }
}
