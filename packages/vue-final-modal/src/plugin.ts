import type { App, ComputedRef } from 'vue'
import { markRaw, nextTick, ref, shallowReactive } from 'vue'
import { internalVfmSymbol, vfmSymbol } from './injectionSymbols'
import type { InternalVfm, Modal, ModalId, UseModalOptions, UseModalOptionsPrivate, Vfm } from './Modal'

export function createVfm() {
  const modals: ComputedRef<Modal>[] = shallowReactive([])
  const openedModals: ComputedRef<Modal>[] = shallowReactive([])
  const dynamicModals: (UseModalOptions & UseModalOptionsPrivate)[] = shallowReactive([])
  const modalsContainers = ref<symbol[]>([])

  const vfm: Vfm = markRaw({
    install(app: App) {
      app.provide(vfmSymbol, vfm)
      app.config.globalProperties.$vfm = vfm

      const internalVfm = createInternalVfm(vfm)
      app.provide(internalVfmSymbol, internalVfm)
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
  })

  return vfm
}

function createInternalVfm(vfm: Vfm) {
  const { modals, openedModals, dynamicModals } = vfm

  const internalVfm: InternalVfm = {
    deleteFromModals(modal: ComputedRef<Modal>) {
      const index = modals.findIndex(_modal => _modal.value === modal.value)
      if (index !== -1)
        modals.splice(index, 1)
    },
    moveToLastOpenedModals(modal: ComputedRef<Modal>) {
      internalVfm.deleteFromOpenedModals(modal)
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
      dynamicModals[index]?.resolveClosed?.()
    },
    resolvedOpened(index: number) {
      dynamicModals[index]?.resolveOpened?.()
    },
  }

  return internalVfm
}
