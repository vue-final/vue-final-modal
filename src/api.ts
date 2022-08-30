import { shallowReactive } from 'vue'
import type { Modal, UseModalOptions } from './Modal'

export const modals: Modal[] = []
export const openedModals: Modal[] = []
export const dynamicModals: UseModalOptions[] = shallowReactive([])

export function show(_nameOrNames: string | string[]) {
  return toggle(_nameOrNames, true)
}

export function hide(...names: string[]) {
  return toggle(names, false)
}

export function hideAll() {
  const names = openedModals.map(modal => modal.props.name).filter((str): str is string => !!str)
  return hide(...names)
}

export function toggle(nameOrNames: string | string[], show?: boolean) {
  const modals = Array.isArray(nameOrNames) ? get(...nameOrNames) : get(nameOrNames)
  return Promise.allSettled(modals.map(modal => modal.toggle(show)))
}

export function get(...names: string[]) {
  return modals.filter(modal => modal.props.name && names.includes(modal.props.name))
}
