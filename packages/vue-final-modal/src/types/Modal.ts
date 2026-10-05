import type { CSSProperties, Component, MaybeRefOrGetter, Ref } from 'vue'
import type { Template } from 'vue-use-template'

import type { ComponentProps, ComponentSlots } from '~/types'

export type ModalId = number | string | symbol
export type StyleValue = string | CSSProperties | (string | CSSProperties)[]

type PickComponentEmits<T extends object> = {
  [K in keyof T as K extends `on${Capitalize<string>}` ? K : never]: T[K]
}
type PickComponentProps<T extends object> = {
  [K in keyof T as K extends `on${Capitalize<string>}` ? never : K]: T[K]
}

export interface ModalTemplate<T extends Component> {
  component: T
  attrs?: MaybeRefOrGetter<ComponentProps<T>>
  emits?: MaybeRefOrGetter<PickComponentEmits<ComponentProps<T>>>
  props?: MaybeRefOrGetter<PickComponentProps<ComponentProps<T>>>
  slots?: {
    [K in keyof ComponentSlots<T>]?: string | Component | Template<Component>
  }
}

export type UseModalOptions<T extends Component> = Omit<ModalTemplate<T>, 'component'> & {
  defaultModelValue?: boolean
  keepAlive?: boolean
  component?: T
}

export interface UseModalReturnType {
  open: () => Promise<string>
  close: () => Promise<string>
  destroy: () => void
}

export type PrivateFields = {
  id: symbol
  resolveOpened: () => void
  resolveClosed: () => void
}

export type ModalExposed = {
  modalId: Ref<undefined | ModalId>
  hideOverlay: Ref<undefined | boolean>
  overlayBehavior: Ref<undefined | 'auto' | 'persist'>
  overlayVisible: Ref<boolean>
  toggle: (show?: boolean) => Promise<string>
}
