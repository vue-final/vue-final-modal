import type { CSSProperties, Ref } from 'vue'
import type VueFinalModal from './components/VueFinalModal.vue'

export type ModalId = number | string | symbol
export type StyleValue = string | CSSProperties | (string | CSSProperties)[]

export interface UseModalOptions {
  component?: InstanceType<typeof VueFinalModal>
  bind?: InstanceType<typeof VueFinalModal>['$props']
  slots?: {
    default?: string | {
      component: any
      bind?: any
      on?: any
    }
  }
  on?: {
    beforeOpen?: (e: { stop: () => void }) => void
    beforeClose?: (e: { stop: () => void }) => void
    closed?: () => void
    opened?: () => void
  }

  id?: Symbol
  modelValue?: boolean
  rejectOpen?: (reason?: string) => void
  resolveOpened?: () => void
  rejectClose?: (reason?: string) => void
  resolveClosed?: () => void
}

export interface Modal {
  modalId?: ModalId
  hideOverlay: Ref<boolean | undefined> | undefined
  overlayVisible: Ref<boolean>
  focus: () => void
  toggle: (show?: boolean) => Promise<string>
}
