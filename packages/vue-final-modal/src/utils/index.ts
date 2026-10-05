import type { Component } from 'vue'
import type { ModalTemplate } from '~/types'

export * from './dom'

export const once
  = (fn: null | ((...args: any[]) => void)) =>
    (...args: any[]) => {
      if (!fn)
        return
      fn?.(...args)
      fn = null
    }

export const noop = () => {}

export function clamp(val: number, min: number, max: number) {
  return val > max ? max : val < min ? min : val
}

/**
 * @example
 * const arr = [1, 2, 6, 3, 4, 5]
 * arrayMoveItemToLast(arr, 6)
 * console.log(arr) // [1, 2, 3, 4, 5, 6]
 */
export function arrayMoveItemToLast<T>(arr: T[], item: T) {
  const removedItem = arrayRemoveItem(arr, item)?.[0] || item
  arr.push(removedItem)
}

export function arrayRemoveItem<T>(arr: T[], item: T) {
  const index = arr.indexOf(item)
  if (index !== -1)
    return arr.splice(index, 1)
}

/**
 * A type helper to define a modal template
 */
export function defineModal<T extends Component>(template: ModalTemplate<T>) {
  return template
}
