import {
  reactive,
} from 'vue'
import type {
  App,
  Component,
  ComponentOptions,
  ComputedRef,
  ConcreteComponent,
  Raw,
  Ref,
  VNodeProps,
} from 'vue'
import type { Modal, ModalId } from './index'
import { ModalBottom, ModalFullscreen, VueFinalModal } from './index'

type RawProps = VNodeProps & {
  // used to differ from a single VNode object as children
  __v_isVNode?: never
  // used to differ from Array children
  [Symbol.iterator]?: never
} & Record<string, any>

type Attrs<P> = (RawProps & P) | ({} extends P ? null : never)

type ModalSlot<P> = {
  component: ConcreteComponent<P>
  attrs?: Attrs<P>
} | {
  component: ComponentOptions<P>
  attrs?: Attrs<P>
}

type DefineModalOptionsBase<P, SP> = {
  attrs?: Attrs<P>
  slots?: {
    default: ModalSlot<SP>
    [key: string]: ModalSlot<SP>
  }
}

type DefineModalOptionsA<P, SP> = {
  component: ConcreteComponent<P>
} & DefineModalOptionsBase<P, SP>

type DefineModalOptionsB<P, SP> = {
  component: ComponentOptions<P>
} & DefineModalOptionsBase<P, SP>

type DefineModalOptions = {
  defaultModelValue?: boolean
  context?: Vfm
  component: Raw<Component>
  attrs?: Record<string, any>
  slots?: Record<string, any>
}

type DefineModalOptionsPrivate = DefineModalOptions & {
  id: symbol
  modelValue: boolean
  resolveOpened: () => void
  resolveClosed: () => void
}
// interface UseModalReturnTypeA {
//   options: DefineModalOptionsPrivate
//   open: () => Promise<string>
//   close: () => Promise<string>
//   patchOptions<P, SP>(options: DefineModalOptionsA<P, SP>): void
//   patchOptions<P, SP>(options: DefineModalOptionsB<P, SP>): void
//   destroy: () => void
// }
// interface UseModalReturnTypeB {
//   options: DefineModalOptionsPrivate
//   open: () => Promise<string>
//   close: () => Promise<string>
//   patchOptions<P, SP>(options: DefineModalOptionsA<P, SP>): void
//   patchOptions<P, SP>(options: DefineModalOptionsB<P, SP>): void
//   destroy: () => void
// }

interface IOverloadedDefineModalFunction {
  <P, SP>(options: DefineModalOptionsA<P, SP>): DefineModalReturnType
  <P, SP>(options: DefineModalOptionsB<P, SP>): DefineModalReturnType
  <P, SP>(options: DefineModalOptionsA<P, SP> | DefineModalOptionsB<P, SP> | DefineModalOptions): DefineModalReturnType
}

interface IOverloadedPatchOptionsFunction {
  <P, SP>(options: DefineModalOptionsA<P, SP>): void
  <P, SP>(options: DefineModalOptionsB<P, SP>): void
  <P, SP>(options: DefineModalOptionsA<P, SP> | DefineModalOptionsB<P, SP> | DefineModalOptions): DefineModalReturnType
}

interface DefineModalReturnType {
  options: DefineModalOptionsPrivate
  open: () => Promise<string>
  close: () => Promise<string>
  patchOptions: IOverloadedPatchOptionsFunction
  destroy: () => void
}

type Vfm = {
  install(app: App): void
  modals: ComputedRef<Modal>[]
  openedModals: ComputedRef<Modal>[]
  dynamicModals: DefineModalOptionsPrivate[]
  modalsContainers: Ref<symbol[]>
  get: (modalId: ModalId) => undefined | ComputedRef<Modal>
  toggle: (modalId: ModalId, show?: boolean) => undefined | Promise<string>
  open: (modalId: ModalId) => undefined | Promise<string>
  close: (modalId: ModalId) => undefined | Promise<string>
  closeAll: () => Promise<[PromiseSettledResult<Promise<string>[]>]>
}

export const defineModal: IOverloadedDefineModalFunction = function (_options: DefineModalOptions): DefineModalReturnType {
  const options = reactive<DefineModalOptionsPrivate>({
    id: Symbol('useModal'),
    modelValue: !!_options?.defaultModelValue,
    resolveOpened: () => {},
    resolveClosed: () => {},
    attrs: {},
    ..._options,
  }) as DefineModalOptionsPrivate

  // if (!options.context)
  //   options.context = useVfm()
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

  function patchOptions(_options: Partial<DefineModalOptions>) {
    const _patchOptions = _options
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

  return {
    options,
    open,
    close,
    patchOptions,
    destroy,
  }
}

export const useModal: IOverloadedDefineModalFunction = function (_options: DefineModalOptions): DefineModalReturnType {
  return defineModal(_options)
}

const modal = useModal({
  component: VueFinalModal,
  attrs: {
    background: 'interactive',
    clickToClose: true,
  },

  slots: {
    default: {
      component: ModalBottom,
      attrs: {

      },
    },
  },
})

modal.patchOptions({
  component: ModalFullscreen,
  attrs: {

  },
})
