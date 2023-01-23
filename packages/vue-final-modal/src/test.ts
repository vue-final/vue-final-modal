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

interface UseModalOptionsConcreteComponent<P> { component: ConcreteComponent<P>; attrs?: Attrs<P> }
interface UseModalOptionsComponentOptions<P> { component: ComponentOptions<P>; attrs?: Attrs<P> }
interface UseModalOptionsBase { component: Raw<Component>; attrs?: Record<string, any> }
interface VfmSlotOptionsConcreteComponent<P> extends UseModalOptionsConcreteComponent<P> {}
interface VfmSlotOptionsComponentOptions<P> extends UseModalOptionsComponentOptions<P> {}
interface VfmSlot extends UseModalOptionsBase {}

type UseModalOptionsSlots = {
  slots?: {
    default: VfmSlot
    [key: string]: VfmSlot
  }
}

type UseModalOptions = {
  defaultModelValue?: boolean
  context?: Vfm
  component: Raw<Component>
  attrs?: Record<string, any>
} & UseModalOptionsSlots

interface IOverloadedUseModalFn {
  <P>(options: UseModalOptionsConcreteComponent<P> & UseModalOptionsSlots): UseModalReturnType
  <P>(options: UseModalOptionsComponentOptions<P> & UseModalOptionsSlots): UseModalReturnType
  <P>(options:
  | UseModalOptionsConcreteComponent<P> & UseModalOptionsSlots
  | UseModalOptionsComponentOptions<P> & UseModalOptionsSlots
  | UseModalOptions
  ): UseModalReturnType
}

interface IOverloadedPatchOptionsFn {
  <P>(options: UseModalOptionsConcreteComponent<P> & UseModalOptionsSlots): void
  <P>(options: UseModalOptionsComponentOptions<P> & UseModalOptionsSlots): void
  <P>(options:
  | UseModalOptionsConcreteComponent<P> & UseModalOptionsSlots
  | UseModalOptionsComponentOptions<P> & UseModalOptionsSlots
  | Omit<UseModalOptions, 'defaultModelValue' | 'context'>
  ): void
}

interface IOverloadedUseVfmSlotFn {
  <P>(options: VfmSlotOptionsConcreteComponent<P>): VfmSlot
  <P>(options: VfmSlotOptionsComponentOptions<P>): VfmSlot
  <P>(options: VfmSlotOptionsConcreteComponent<P> | VfmSlotOptionsComponentOptions<P> | VfmSlot): VfmSlot
}

export const useModalSlot: IOverloadedUseVfmSlotFn = (options: VfmSlot): VfmSlot => options

type UseModalOptionsPrivate = {
  id: symbol
  modelValue: boolean
  resolveOpened: () => void
  resolveClosed: () => void
}

interface UseModalReturnType {
  options: UseModalOptions & UseModalOptionsPrivate
  open: () => Promise<string>
  close: () => Promise<string>
  patchOptions: IOverloadedPatchOptionsFn
  destroy: () => void
}

type Vfm = {
  install(app: App): void
  modals: ComputedRef<Modal>[]
  openedModals: ComputedRef<Modal>[]
  dynamicModals: (UseModalOptions & UseModalOptionsPrivate)[]
  modalsContainers: Ref<symbol[]>
  get: (modalId: ModalId) => undefined | ComputedRef<Modal>
  toggle: (modalId: ModalId, show?: boolean) => undefined | Promise<string>
  open: (modalId: ModalId) => undefined | Promise<string>
  close: (modalId: ModalId) => undefined | Promise<string>
  closeAll: () => Promise<[PromiseSettledResult<Promise<string>[]>]>
}

export const useModal: IOverloadedUseModalFn = function (_options: UseModalOptions): UseModalReturnType {
  const options = reactive<UseModalOptions & UseModalOptionsPrivate>({
    id: Symbol('useModal'),
    modelValue: !!_options?.defaultModelValue,
    resolveOpened: () => {},
    resolveClosed: () => {},
    attrs: {},
    ..._options,
  }) as UseModalOptions & UseModalOptionsPrivate

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

const modal = useModal({
  component: VueFinalModal,
  attrs: {
    background: 'dinteractive',

  },
  slots: {
    default: useModalSlot({
      component: ModalBottom,
      attrs: {
        threshold: 30,

      },
    }),
    asdf: useModalSlot({
      component: ModalFullscreen,
      attrs: {
        closeDirection: 'RIGHT',
      },
    }),
  },
})

modal.patchOptions({
  component: ModalFullscreen,
  attrs: {
    threshold: 30,

  },

})
