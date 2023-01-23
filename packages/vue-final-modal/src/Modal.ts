import type { App, CSSProperties, Component, ComponentOptions, ComponentPublicInstance, ComputedRef, ConcreteComponent, Raw, Ref, VNodeProps } from 'vue'

export type ComponentProps = ComponentPublicInstance['$props']

export type ModalId = number | string | symbol
export type StyleValue = string | CSSProperties | (string | CSSProperties)[]

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
interface ModalSlotOptionsConcreteComponent<P> extends UseModalOptionsConcreteComponent<P> {}
interface ModalSlotOptionsComponentOptions<P> extends UseModalOptionsComponentOptions<P> {}
type ModalSlot = string | Component | UseModalOptionsBase

export type UseModalOptionsSlots = {
  slots?: string | Component | {
    default: ModalSlot
    [key: string]: ModalSlot
  }
}

export type UseModalOptions = {
  defaultModelValue?: boolean
  context?: Vfm
  component: Raw<Component>
  attrs?: Record<string, any>
} & UseModalOptionsSlots

export interface IOverloadedUseModalFn {
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

interface IOverloadedUseModalSlotFn {
  <P>(options: ModalSlotOptionsConcreteComponent<P>): ModalSlot
  <P>(options: ModalSlotOptionsComponentOptions<P>): ModalSlot
  <P>(options: ModalSlotOptionsConcreteComponent<P> | ModalSlotOptionsComponentOptions<P> | ModalSlot): ModalSlot
}

export const useModalSlot: IOverloadedUseModalSlotFn = (options: ModalSlot): ModalSlot => options

export type UseModalOptionsPrivate = {
  id: symbol
  modelValue: boolean
  resolveOpened: () => void
  resolveClosed: () => void
}

export interface UseModalReturnType {
  options: UseModalOptions & UseModalOptionsPrivate
  open: () => Promise<string>
  close: () => Promise<string>
  patchOptions: IOverloadedPatchOptionsFn
  destroy: () => void
}

export type Vfm = {
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

export type InternalVfm = {
  deleteFromModals: (modal: ComputedRef<Modal>) => void
  moveToLastOpenedModals: (modal: ComputedRef<Modal>) => void
  deleteFromOpenedModals: (modal: ComputedRef<Modal>) => void
  openLastOverlay: () => Promise<void>
  resolvedClosed: (index: number) => void
  resolvedOpened: (index: number) => void
}

export type Modal = {
  modalId?: ModalId
  hideOverlay: Ref<boolean | undefined> | undefined
  overlayVisible: Ref<boolean>
  focus: () => void
  toggle: (show?: boolean) => Promise<string>
}
