import type { CSSProperties, Component, ComponentPublicInstance, Ref } from 'vue'

export type ComponentProps = ComponentPublicInstance['$props']

export type ModalId = number | string | symbol
export type StyleValue = string | CSSProperties | (string | CSSProperties)[]

export interface UseModalPrivate<
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

export type UseModal<
  ModalProps extends ComponentProps,
  DefaultSlotProps extends ComponentProps,
> = Pick<
  UseModalPrivate<ModalProps, DefaultSlotProps>,
  | 'component'
  | 'attrs'
  | 'slots'
>

export interface Modal {
  modalId?: ModalId
  hideOverlay: Ref<boolean | undefined> | undefined
  overlayVisible: Ref<boolean>
  focus: () => void
  toggle: (show?: boolean) => Promise<string>
}
