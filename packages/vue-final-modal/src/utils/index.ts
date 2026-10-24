import type { Component } from 'vue'
import type { TemplateAttrs } from 'vue-use-template'
import type { ModalTemplate } from '~/types'

export function noop() {}

export interface Pending<R> {
  promise: Promise<R>
  resolve: (result: R) => void
}

export function createPending<R>(): Pending<R> {
  let resolve: (result: R) => void = noop
  const promise = new Promise<R>(settle => resolve = settle)
  return { promise, resolve }
}

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
export function defineModal<T extends Component, K extends keyof TemplateAttrs<T> = never>(template: ModalTemplate<T, K>) {
  return template
}
