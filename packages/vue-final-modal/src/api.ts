import type { ComputedRef } from 'vue'
import { nextTick, ref, shallowReactive } from 'vue'
import type { Modal, ModalId, UseModalOptionsPrivate } from './Modal'

export const modals: ComputedRef<Modal>[] = []
export function deleteFromModals(modal: ComputedRef<Modal>) {
  const index = modals.findIndex(_modal => _modal.value === modal.value)
  if (index !== -1)
    modals.splice(index, 1)
}

export const openedModals: ComputedRef<Modal>[] = []
export function moveToLastOpenedModals(modal: ComputedRef<Modal>) {
  deleteFromOpenedModals(modal)
  openedModals.push(modal)
}
export function deleteFromOpenedModals(modal: ComputedRef<Modal>) {
  const index = openedModals.findIndex(_modal => _modal.value === modal.value)
  if (index !== -1)
    openedModals.splice(index, 1)
}

export async function openLastOverlay() {
  await nextTick()
  // Close all overlay first
  openedModals.forEach(modal => modal.value.overlayVisible.value = false)
  // Open the last overlay if it has overlay
  if (openedModals.length > 0) {
    const modal = openedModals[openedModals.length - 1]
    !modal.value.hideOverlay?.value && (modal.value.overlayVisible.value = true)
  }
}

export const dynamicModals: UseModalOptionsPrivate<{}, {}>[] = shallowReactive([])

export function resolvedClosed(index: number) {
  dynamicModals[index].resolveClosed?.()
}

export function resolvedOpened(index: number) {
  dynamicModals[index].resolveOpened?.()
}

export function get(modalId: ModalId) {
  return modals.find(modal => modal.value.modalId && modalId === modal.value.modalId)
}

export function toggle(modalId: ModalId, show?: boolean) {
  const modal = get(modalId)
  return modal?.value.toggle(show)
}

export function open(modalId: ModalId) {
  return toggle(modalId, true)
}

export function close(modalId: ModalId) {
  return toggle(modalId, false)
}

export function closeAll() {
  return Promise.allSettled([openedModals.map(modal => modal.value.toggle(false))])
}

export const modalsContainers = ref<symbol[]>([])

interface UseVfm {
  modals: ComputedRef<Modal>[]
  openedModals: ComputedRef<Modal>[]
  dynamicModals: UseModalOptionsPrivate<{}, {}>[]
  get: (modalId: ModalId) => undefined | ComputedRef<Modal>
  toggle: (modalId: ModalId) => undefined | Promise<string>
  open: (modalId: ModalId) => undefined | Promise<string>
  close: (modalId: ModalId) => undefined | Promise<string>
  closeAll: () => Promise<[PromiseSettledResult<Promise<string>[]>]>
}

export function useVfm(): UseVfm {
  return {
    modals,
    openedModals,
    dynamicModals,
    get,
    toggle,
    open,
    close,
    closeAll,
  }
}
