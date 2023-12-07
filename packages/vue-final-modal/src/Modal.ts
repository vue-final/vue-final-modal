import type { App, CSSProperties, ComputedRef, FunctionalComponent, Raw, Ref } from 'vue'

export type ModalId = number | string | symbol
export type StyleValue = string | CSSProperties | (string | CSSProperties)[]

/** A fake Component Constructor that is only used for extracting `$props` as type `P` */
type Constructor<P = any> = {
  __isFragment?: never
  __isTeleport?: never
  __isSuspense?: never
  new(...args: any[]): { $props: P }
}

export interface ModalSlotOptions { component: Raw<ComponentType>; attrs?: Record<string, any> }
export type ModalSlot = string | ComponentType | ModalSlotOptions

type ComponentConstructor = (abstract new (...args: any) => any)
/** Including both generic and non-generic vue components */
export type ComponentType = ComponentConstructor | FunctionalComponent<any, any>

type FunctionalComponentProps<T> = T extends FunctionalComponent<infer P> ? P : Record<any, any>
type NonGenericComponentProps<T> = T extends Constructor<infer P> ? P : Record<any, any>
export type ComponentProps<T extends ComponentType> =
  T extends ComponentConstructor
    ? NonGenericComponentProps<T>
    : FunctionalComponentProps<T>

export type UseModalOptions<T extends ComponentType> = {
  defaultModelValue?: boolean
  keepAlive?: boolean
  component?: T
  attrs?: ComponentProps<T>
  slots?: {
    [key: string]: ModalSlot
  }
}

export type UseModalOptionsPrivate = {
  id: symbol
  modelValue: boolean
  resolveOpened: () => void
  resolveClosed: () => void
}

export interface UseModalReturnType<T extends ComponentType> {
  options: UseModalOptions<T> & UseModalOptionsPrivate
  open: () => Promise<string>
  close: () => Promise<string>
  patchOptions: (options: Partial<UseModalOptions<T>>) => void
  destroy: () => void
}

export type Vfm = {
  install(app: App): void
  modals: ComputedRef<Modal>[]
  openedModals: ComputedRef<Modal>[]
  openedModalOverlays: ComputedRef<Modal>[]
  dynamicModals: (UseModalOptions<any> & UseModalOptionsPrivate)[]
  modalsContainers: Ref<symbol[]>
  get: (modalId: ModalId) => undefined | ComputedRef<Modal>
  toggle: (modalId: ModalId, show?: boolean) => undefined | Promise<string>
  open: (modalId: ModalId) => undefined | Promise<string>
  close: (modalId: ModalId) => undefined | Promise<string>
  closeAll: () => Promise<PromiseSettledResult<string>[]>
}

export type InternalVfm = {
  openLastOverlay: () => Promise<void>
  moveToLastOpenedModals: (modal: ComputedRef<Modal>) => void
  deleteFromOpenedModals: (modal: ComputedRef<Modal>) => void
  moveToLastOpenedModalOverlays: (modal: ComputedRef<Modal>) => void
  deleteFromOpenedModalOverlays: (modal: ComputedRef<Modal>) => void
  deleteFromModals: (modal: ComputedRef<Modal>) => void
  resolvedClosed: (index: number) => void
  resolvedOpened: (index: number) => void
}

export type Modal = {
  modalId?: ModalId
  hideOverlay: Ref<boolean | undefined> | undefined
  overlayVisible: Ref<boolean>
  toggle: (show?: boolean) => Promise<string>
}
