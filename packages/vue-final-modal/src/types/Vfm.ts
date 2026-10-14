import type { App, ComputedRef } from 'vue'
import type { ModalCloseResult, ModalExposed, ModalId, ModalOpenResult } from './Modal'

export type Vfm = {
  install: (app: App) => void
  modals: ComputedRef<ModalExposed>[]
  openedModals: ComputedRef<ModalExposed>[]
  openedModalOverlays: ComputedRef<ModalExposed>[]
  get: (modalId: ModalId) => undefined | ComputedRef<ModalExposed>
  toggle: VfmToggle
  open: (modalId: ModalId) => undefined | Promise<ModalOpenResult>
  close: (modalId: ModalId) => undefined | Promise<ModalCloseResult>
  closeAll: () => Promise<PromiseSettledResult<ModalCloseResult>[]>
}

/** Toggles the modal of `modalId`, or gives `undefined` when no modal has that id. */
export interface VfmToggle {
  (modalId: ModalId, show: true): undefined | Promise<ModalOpenResult>
  (modalId: ModalId, show: false): undefined | Promise<ModalCloseResult>
  (modalId: ModalId, show?: boolean): undefined | Promise<ModalOpenResult | ModalCloseResult>
}
