import type { ComputedRef } from 'vue'
import { shallowReactive } from 'vue'
import type { Modal, UseModalOptions } from './Modal'

export const modals: ComputedRef<Modal>[] = []
export function deleteModalFromModals(modal: ComputedRef<Modal>) {
  const index = modals.findIndex(_modal => _modal.value === modal.value)
  if (index !== -1)
    modals.splice(index, 1)
}

export const openedModals: ComputedRef<Modal>[] = []
export function moveModalToLastOpenedModals(modal: ComputedRef<Modal>) {
  deleteModalFromOpenedModals(modal)
  openedModals.push(modal)
}
export function deleteModalFromOpenedModals(modal: ComputedRef<Modal>) {
  const index = openedModals.findIndex(_modal => _modal.value === modal.value)
  if (index !== -1)
    openedModals.splice(index, 1)
}

export const dynamicModals: UseModalOptions[] = shallowReactive([])

export function open(modalId: string) {
  return toggle(modalId, true)
}

export function close(modalId: string) {
  return toggle(modalId, false)
}

export function closeAll() {
  return Promise.allSettled([openedModals.map(modal => modal.value.toggle(false))])
}

export function toggle(modalId: string, show?: boolean) {
  const modal = get(modalId)
  return modal?.value.toggle(show)
}

export function get(modalId: string) {
  return modals.find(modal => modal.value.modalId && modalId === modal.value.modalId)
}
