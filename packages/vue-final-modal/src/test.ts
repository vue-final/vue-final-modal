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

interface VfmSlot { component: Raw<Component>; attrs?: Record<string, any> }
interface VfmSlotA<P> { component: ConcreteComponent<P>; attrs?: Attrs<P> }
interface VfmSlotB<P> { component: ComponentOptions<P>; attrs?: Attrs<P> }

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
  <P>(options: VfmSlotA<P> & UseModalOptionsSlots): UseModalReturnType
  <P>(options: VfmSlotB<P> & UseModalOptionsSlots): UseModalReturnType
  <P>(options: VfmSlotA<P> & UseModalOptionsSlots | VfmSlotB<P> & UseModalOptionsSlots | UseModalOptions): UseModalReturnType
}

interface IOverloadedPatchOptionsFn {
  <P>(options: VfmSlotA<P> & UseModalOptionsSlots): void
  <P>(options: VfmSlotB<P> & UseModalOptionsSlots): void
  <P>(options: VfmSlotA<P> & UseModalOptionsSlots | VfmSlotB<P> & UseModalOptionsSlots | UseModalOptions): void
}

interface IOverloadedUseVfmSlotFn {
  <P>(options: VfmSlotA<P>): VfmSlot
  <P>(options: VfmSlotB<P>): VfmSlot
  <P>(options: VfmSlotA<P> | VfmSlotB<P> | VfmSlot): VfmSlot
}

const useVfmSlot: IOverloadedUseVfmSlotFn = (options: VfmSlot): VfmSlot => options

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

// export const useModal: IOverloadedUseModalFn = function (_options: UseModalOptions): UseModalReturnType {
//   return defineModal(_options)
// }

const modal = useModal({
  component: VueFinalModal,
  attrs: {
    background: 'interactive',
  },
  slots: {
    default: useVfmSlot({
      component: ModalBottom,
      attrs: {
        threshold: 30,
      },
    }),
    asdf: useVfmSlot({
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
