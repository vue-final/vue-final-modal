import type { App, CSSProperties, Component, ComponentInternalInstance, FunctionalComponent, Raw, Ref } from 'vue'
import type { ComponentProps, ComponentSlots } from './Component'

export type ModalId = number | string | symbol
export type StyleValue = string | CSSProperties | (string | CSSProperties)[]

export interface ModalSlotOptions { component: Raw<Component>; attrs?: Record<string, any> }
export type ModalSlot = string | Component | ModalSlotOptions

type ComponentConstructor = (abstract new (...args: any) => any)
/** Including both generic and non-generic vue components */
export type ComponentType = ComponentConstructor | FunctionalComponent<any, any>

export type UseModalOptions<T extends Component> = {
  defaultModelValue?: boolean
  keepAlive?: boolean
  component?: T
  attrs?: ComponentProps<T>
  slots?: {
    [K in keyof ComponentSlots<T>]?: ModalSlot
  }
}

export type UseModalOptionsPrivate = {
  id: symbol
  modelValue: boolean
  resolveOpened: () => void
  resolveClosed: () => void
}

export type ModalPatchOptions<T extends Component> = Partial<UseModalOptions<T>> & {
  attrs?: Partial<ComponentProps<T>>
}

export interface UseModalReturnType<T extends Component> {
  options: UseModalOptions<T> & UseModalOptionsPrivate
  open: () => Promise<string>
  close: () => Promise<string>
  patchOptions: (options: ModalPatchOptions<T>) => void
  destroy: () => void
}

export type Vfm = {
  install(app: App): void
  modals: ComponentInternalInstance[]
  openedModals: ComponentInternalInstance[]
  openedModalOverlays: ComponentInternalInstance[]
  dynamicModals: (UseModalOptions<Component> & UseModalOptionsPrivate)[]
  modalsContainers: Ref<symbol[]>
  get: (modalId: ModalId) => undefined | ComponentInternalInstance
  toggle: (modalId: ModalId, show?: boolean) => undefined | Promise<string>
  open: (modalId: ModalId) => undefined | Promise<string>
  close: (modalId: ModalId) => undefined | Promise<string>
  closeAll: () => Promise<PromiseSettledResult<string>[]>
}

export type ModalExposed = {
  modalId?: Ref<undefined | ModalId>
  hideOverlay?: Ref<undefined | boolean>
  overlayBehavior: Ref<'auto' | 'persist'>
  overlayVisible: Ref<boolean>
  toggle: (show?: boolean) => Promise<string>
}
