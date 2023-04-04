import type { App, ComputedRef } from 'vue'
import { getCurrentInstance, inject, markRaw, nextTick, ref, shallowReactive } from 'vue'
import { internalVfmSymbol, vfmSymbol } from './injectionSymbols'
import type { InternalVfm, Modal, ModalId, UseModalOptions, UseModalOptionsPrivate, Vfm } from './Modal'

// eslint-disable-next-line import/no-mutable-exports
export let activeVfm: Vfm | undefined

export const setActiveVfm = (vfm: Vfm | undefined) =>
  (activeVfm = vfm)

export const getActiveVfm = () =>
  (getCurrentInstance() && inject(vfmSymbol)) || activeVfm

export function createVfm() {
  const modals: ComputedRef<Modal>[] = shallowReactive([])
  const openedModals: ComputedRef<Modal>[] = shallowReactive([])
  const openedModalOverlays: ComputedRef<Modal>[] = shallowReactive([])
  const dynamicModals: (UseModalOptions<any> & UseModalOptionsPrivate)[] = shallowReactive([])
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
    openedModalOverlays,
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

  setActiveVfm(vfm)

  return vfm
}

function createInternalVfm(vfm: Vfm) {
  const { modals, openedModals, openedModalOverlays, dynamicModals } = vfm

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
    moveToLastOpenedModalOverlays(modal: ComputedRef<Modal>) {
      internalVfm.deleteFromOpenedModalOverlays(modal)
      openedModalOverlays.push(modal)
    },
    deleteFromOpenedModalOverlays(modal: ComputedRef<Modal>) {
      const index = openedModalOverlays.findIndex(_modal => _modal.value === modal.value)
      if (index !== -1)
        openedModalOverlays.splice(index, 1)
    },
    async openLastOverlay() {
      await nextTick()
      // Close all overlay first
      openedModalOverlays.forEach(modal => modal.value.overlayVisible.value = false)
      // Open the last overlay if it has overlay
      if (openedModalOverlays.length > 0) {
        const modal = openedModalOverlays[openedModalOverlays.length - 1]
        !modal.value.hideOverlay?.value && (modal.value.overlayVisible.value = true)
      }
    },
    resolvedClosed(index: number) {
      dynamicModals[index]?.resolveClosed?.()
      if (!dynamicModals[index]?.keepAlive)
        dynamicModals.splice(index, 1)
    },
    resolvedOpened(index: number) {
      dynamicModals[index]?.resolveOpened?.()
    },
  }

  return internalVfm
}
