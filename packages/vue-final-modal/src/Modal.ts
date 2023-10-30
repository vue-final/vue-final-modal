import type { App, CSSProperties, Component, ComputedRef, Raw, Ref } from 'vue'
import type { ComponentProps } from 'vue-component-type-helpers'

export type ModalId = number | string | symbol
export type StyleValue = string | CSSProperties | (string | CSSProperties)[]

export interface ModalSlotOptions { component: Raw<Component>; attrs?: Record<string, any> }
export type ModalSlot = string | Component | ModalSlotOptions

export type UseModalOptions<P> = {
  defaultModelValue?: boolean
  keepAlive?: boolean
  component?: Component<P>
  attrs?: ComponentProps<Component<P>>
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

export interface UseModalReturnType<P> {
  options: UseModalOptions<P> & UseModalOptionsPrivate
  open: () => Promise<string>
  close: () => Promise<string>
  patchOptions: (options: Partial<UseModalOptions<P>>) => void
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
  closeAll: () => Promise<[PromiseSettledResult<Promise<string>[]>]>
}

export type InternalVfm = {
  deleteFromModals: (modal: ComputedRef<Modal>) => void
  moveToLastOpenedModals: (modal: ComputedRef<Modal>) => void
  deleteFromOpenedModals: (modal: ComputedRef<Modal>) => void
  moveToLastOpenedModalOverlays: (modal: ComputedRef<Modal>) => void
  deleteFromOpenedModalOverlays: (modal: ComputedRef<Modal>) => void
  openLastOverlay: () => Promise<void>
  resolvedClosed: (index: number) => void
  resolvedOpened: (index: number) => void
}

export type Modal = {
  modalId?: ModalId
  hideOverlay: Ref<boolean | undefined> | undefined
  overlayVisible: Ref<boolean>
  toggle: (show?: boolean) => Promise<string>
}
