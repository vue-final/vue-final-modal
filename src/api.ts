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

export function show(name: string) {
  return toggle(name, true)
}

export function hide(name: string) {
  return toggle(name, false)
}

export function hideAll() {
  return Promise.allSettled([openedModals.map(modal => modal.value.toggle(false))])
}

export function toggle(name: string, show?: boolean) {
  const modal = get(name)
  return modal?.value.toggle(show)
}

export function get(name: string) {
  return modals.find(modal => modal.value.props.name && name === modal.value.props.name)
}
