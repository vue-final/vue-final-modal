import type { App, CSSProperties, Component, ComputedRef, Ref } from 'vue'
import type { CreateContainer, Template } from 'vue-use-template'

import type { ComponentProps, ComponentSlots } from '~/types'

export type ModalId = number | string | symbol
export type StyleValue = string | CSSProperties | (string | CSSProperties)[]

export type UseModalTemplate<T extends Component> = {
  defaultModelValue?: boolean
  keepAlive?: boolean
  component?: T
  attrs?: ComponentProps<T>
  slots?: {
    [K in keyof ComponentSlots<T>]?: string | Component | Template<Component>
  }
}

export type UseModalTemplatePrivate = {
  id: symbol
  modelValue: boolean
  resolveOpened: () => void
  resolveClosed: () => void
}

export interface UseModalReturnType<T extends Component> {
  template: UseModalTemplate<T> & UseModalTemplatePrivate
  open: () => Promise<string>
  close: () => Promise<string>
  patchTemplate: (template: Partial<UseModalTemplate<T>>) => void
  destroy: () => void
}

export type Vfm = {
  install(app: App): void
  modals: ComputedRef<ModalExposed>[]
  openedModals: ComputedRef<ModalExposed>[]
  openedModalOverlays: ComputedRef<ModalExposed>[]
  get: (modalId: ModalId) => undefined | ComputedRef<ModalExposed>
  toggle: (modalId: ModalId, show?: boolean) => undefined | Promise<string>
  open: (modalId: ModalId) => undefined | Promise<string>
  close: (modalId: ModalId) => undefined | Promise<string>
  closeAll: () => Promise<PromiseSettledResult<string>[]>
} & Partial<CreateContainer>

export type ModalExposed = {
  modalId: Ref<undefined | ModalId>
  hideOverlay: Ref<undefined | boolean>
  overlayBehavior: Ref<undefined | 'auto' | 'persist'>
  overlayVisible: Ref<boolean>
  toggle: (show?: boolean) => Promise<string>
}
