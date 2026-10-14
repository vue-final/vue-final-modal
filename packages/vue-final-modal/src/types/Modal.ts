import type { Component, CSSProperties, MaybeRef, MaybeRefOrGetter, Ref } from 'vue'
import type { Template, TemplateAttrs, TemplateProps } from 'vue-use-template'

export type ModalId = number | string | symbol
export type StyleValue = string | CSSProperties | (string | CSSProperties)[]

/** A string slot is rendered as raw HTML, like `v-html`: never pass user-provided content as a string. */
export type ModalTemplate<T extends Component, K extends keyof TemplateAttrs<T> = keyof TemplateAttrs<T>> = Template<T, K>

type ModalSlots<T extends Component> = NonNullable<ModalTemplate<T>['slots']>
type ModalSlot = string | Component | (Omit<Template<Component>, 'attrs'> & { attrs?: MaybeRefOrGetter<Record<string, unknown>> })

/** `K` is inferred from the names given in attrs, so that props only has to give the required props they leave out. */
export type UseModalOptions<T extends Component, K extends keyof TemplateAttrs<T> = keyof TemplateAttrs<T>> = {
  defaultModelValue?: boolean
  keepAlive?: boolean
  component?: T
  attrs?: MaybeRefOrGetter<{ [P in K]?: TemplateAttrs<T>[P] }>
  emits?: ModalTemplate<T>['emits']
  slots?: { [K in keyof ModalSlots<T>]?: MaybeRef<ModalSlots<T>[K] | ModalSlot> }
} & TemplateProps<T, K>

export interface UseModalReturnType {
  open: () => Promise<string>
  close: () => Promise<string>
  destroy: () => void
}

export type ModalExposed = {
  modalId: Ref<undefined | ModalId>
  hideOverlay: Ref<undefined | boolean>
  overlayBehavior: Ref<undefined | 'auto' | 'persist'>
  overlayVisible: Ref<boolean>
  toggle: (show?: boolean) => Promise<string>
}
