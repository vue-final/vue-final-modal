import type { App, ComputedRef } from 'vue'
import { markRaw, nextTick, ref, shallowReactive } from 'vue'
import { vfmSymbol } from './injectionSymbols'
import type { Modal, ModalId, UseModalOptionsPrivate, Vfm } from './Modal'

export function createVfm() {
  const modals: ComputedRef<Modal>[] = []
  const openedModals: ComputedRef<Modal>[] = []
  const dynamicModals: UseModalOptionsPrivate<{}, {}>[] = shallowReactive([])
  const modalsContainers = ref<symbol[]>([])

  const vfm: Vfm = markRaw({
    install(app: App) {
      app.provide(vfmSymbol, vfm)
      app.config.globalProperties.$vfm = vfm
    },
    modals,
    openedModals,
    dynamicModals,
    modalsContainers,
    get(modalId: ModalId) {
      return modals.find(modal => modal.value.modalId && modalId === modal.value.modalId)
    },
    toggle(modalId: ModalId, show?: boolean) {
      const modal = vfm.get(modalId)
      return modal?.value.toggle(show)
    },
    open(modalId: ModalId) {
      return vfm.toggle(modalId, true)
    },
    close(modalId: ModalId) {
      return vfm.toggle(modalId, false)
    },
    closeAll() {
      return Promise.allSettled([openedModals.map(modal => modal.value.toggle(false))])
    },
    deleteFromModals(modal: ComputedRef<Modal>) {
      const index = modals.findIndex(_modal => _modal.value === modal.value)
      if (index !== -1)
        modals.splice(index, 1)
    },
    moveToLastOpenedModals(modal: ComputedRef<Modal>) {
      vfm.deleteFromOpenedModals(modal)
      openedModals.push(modal)
    },
    deleteFromOpenedModals(modal: ComputedRef<Modal>) {
      const index = openedModals.findIndex(_modal => _modal.value === modal.value)
      if (index !== -1)
        openedModals.splice(index, 1)
    },
    async openLastOverlay() {
      await nextTick()
      // Close all overlay first
      openedModals.forEach(modal => modal.value.overlayVisible.value = false)
      // Open the last overlay if it has overlay
      if (openedModals.length > 0) {
        const modal = openedModals[openedModals.length - 1]
        !modal.value.hideOverlay?.value && (modal.value.overlayVisible.value = true)
      }
    },
    resolvedClosed(index: number) {
      dynamicModals[index].resolveClosed?.()
      dynamicModals.splice(index, 1)
    },
    resolvedOpened(index: number) {
      dynamicModals[index].resolveOpened?.()
    },
  })

  return vfm
}
