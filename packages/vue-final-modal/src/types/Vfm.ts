import type { App, ComputedRef } from 'vue'
import type { ModalExposed, ModalId } from './Modal'

export type Vfm = {
  install: (app: App) => void
  modals: ComputedRef<ModalExposed>[]
  openedModals: ComputedRef<ModalExposed>[]
  openedModalOverlays: ComputedRef<ModalExposed>[]
  get: (modalId: ModalId) => undefined | ComputedRef<ModalExposed>
  toggle: (modalId: ModalId, show?: boolean) => undefined | Promise<string>
  open: (modalId: ModalId) => undefined | Promise<string>
  close: (modalId: ModalId) => undefined | Promise<string>
  closeAll: () => Promise<PromiseSettledResult<string>[]>
}
