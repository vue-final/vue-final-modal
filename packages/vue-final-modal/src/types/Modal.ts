import type { CSSProperties, Component, Ref } from 'vue'
import type { Template } from 'vue-use-template'

export type ModalId = number | string | symbol
export type StyleValue = string | CSSProperties | (string | CSSProperties)[]

/** A string slot is rendered as raw HTML, like `v-html`: never pass user-provided content as a string. */
export type ModalTemplate<T extends Component> = Template<T>

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
