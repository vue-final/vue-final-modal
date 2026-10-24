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

/** Where a modal is: `opening` and `closing` last until its transitions have finished. */
export type ModalStatus = 'closed' | 'opening' | 'opened' | 'closing'

/** What opening a modal resolves with: `opened` once its enter transition has finished, otherwise why it did not get there. */
export type ModalOpenResult = 'opened' | 'already-opened' | 'stopped' | 'toggled-again' | 'destroyed' | 'skipped-on-server'

/** What closing a modal resolves with: `closed` once its leave transition has finished, otherwise why it did not get there. */
export type ModalCloseResult = 'closed' | 'already-closed' | 'stopped' | 'toggled-again' | 'destroyed'

/** Opens or closes a modal, or does the opposite of where it is heading without `show`. */
export interface ModalToggle {
  (show: true): Promise<ModalOpenResult>
  (show: false): Promise<ModalCloseResult>
  (show?: boolean): Promise<ModalOpenResult | ModalCloseResult>
}

export interface UseModalReturnType {
  /** Called while the modal is opening, it settles with that opening. */
  open: () => Promise<ModalOpenResult>
  /** Called while the modal is closing, it settles with that closing. Called while it is opening, it closes it once it has opened. */
  close: () => Promise<ModalCloseResult>
  destroy: () => void
  status: Readonly<Ref<ModalStatus>>
}

export type ModalExposed = {
  modalId: Ref<undefined | ModalId>
  hideOverlay: Ref<undefined | boolean>
  overlayBehavior: Ref<undefined | 'auto' | 'persist'>
  overlayVisible: Ref<boolean>
  status: Readonly<Ref<ModalStatus>>
  toggle: ModalToggle
}
