import type { Component } from 'vue'
import type { ModalTemplate } from '~/types'

export const noop = () => {}

export const TOGGLED_AGAIN = '[Vue Final Modal] modal was toggled again before it finished.'
export const OPEN_STOPPED = '[Vue Final Modal] beforeOpen stopped the modal from opening.'
export const CLOSE_STOPPED = '[Vue Final Modal] beforeClose stopped the modal from closing.'
export const ALREADY_OPENED = '[Vue Final Modal] modal is already opened.'
export const ALREADY_CLOSED = '[Vue Final Modal] modal is already closed.'
export const DESTROYED = '[Vue Final Modal] modal was destroyed before it finished.'

export function clamp(val: number, min: number, max: number) {
  return val > max ? max : val < min ? min : val
}

export function arrayMoveItemToLast<T>(arr: T[], item: T) {
  arrayRemoveItem(arr, item)
  arr.push(item)
}

export function arrayRemoveItem<T>(arr: T[], item: T) {
  const index = arr.indexOf(item)
  if (index !== -1)
    arr.splice(index, 1)
}

/**
 * A type helper to define a modal template
 */
export function defineModal<T extends Component>(template: ModalTemplate<T>) {
  return template
}
