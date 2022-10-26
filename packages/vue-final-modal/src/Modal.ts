import type { App, CSSProperties, Component, ComponentPublicInstance, ComputedRef, Ref } from 'vue'

export type ComponentProps = ComponentPublicInstance['$props']

export type ModalId = number | string | symbol
export type StyleValue = string | CSSProperties | (string | CSSProperties)[]

export interface UseModalOptionsPrivate<
  ModalProps extends ComponentProps,
  DefaultSlotProps extends ComponentProps,
> {
  component: Component
  attrs?: ModalProps
  slots?: {
    default: string | {
      component: Component
      attrs?: DefaultSlotProps
    }
    [key: string]: any
  }

  id?: symbol
  modelValue?: boolean
  resolveOpened?: () => void
  resolveClosed?: () => void
}

export type UseModalOptions<
  ModalProps extends ComponentProps,
  DefaultSlotProps extends ComponentProps = {},
> = Pick<
  UseModalOptionsPrivate<ModalProps, DefaultSlotProps>,
  | 'component'
  | 'attrs'
  | 'slots'
>

export interface UseModalReturnType<ModalProps extends ComponentProps, DefaultSlotProps extends ComponentProps> {
  open: () => Promise<unknown>
  close: () => Promise<unknown>
  options: UseModalOptions<ModalProps, DefaultSlotProps>
  mergeOptions: (options: UseModalOptions<ModalProps, DefaultSlotProps>) => void
}

export interface Vfm {
  install(app: App): void
  modals: ComputedRef<Modal>[]
  openedModals: ComputedRef<Modal>[]
  dynamicModals: UseModalOptionsPrivate<{}, {}>[]
  modalsContainers: Ref<symbol[]>
  get: (modalId: ModalId) => undefined | ComputedRef<Modal>
  toggle: (modalId: ModalId, show?: boolean) => undefined | Promise<string>
  open: (modalId: ModalId) => undefined | Promise<string>
  close: (modalId: ModalId) => undefined | Promise<string>
  closeAll: () => Promise<[PromiseSettledResult<Promise<string>[]>]>
}

export interface InternalVfm {
  deleteFromModals: (modal: ComputedRef<Modal>) => void
  moveToLastOpenedModals: (modal: ComputedRef<Modal>) => void
  deleteFromOpenedModals: (modal: ComputedRef<Modal>) => void
  openLastOverlay: () => Promise<void>
  resolvedClosed: (index: number) => void
  resolvedOpened: (index: number) => void
}

export interface Modal {
  modalId?: ModalId
  hideOverlay: Ref<boolean | undefined> | undefined
  overlayVisible: Ref<boolean>
  focus: () => void
  toggle: (show?: boolean) => Promise<string>
}
