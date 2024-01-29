import type { Component, VNode } from 'vue'
import { h } from 'vue'
import { tryOnUnmounted } from '@vueuse/core'
import type { C2VOptions } from './Modal'
import { pushVNode, removeVNode } from './useVfm'
import type { ComponentSlots } from './Component'
import { isString, objectEntries } from './utils'

/**
 * Create a dynamic vNode.
 */
export function useC2v<T extends Component>(_options: C2VOptions<T>) {
  const id = Symbol(__DEV__ ? 'useC2v' : '')

  const vNode = h(_options.component, { key: id, ..._options.attrs }, _options.slots)

  tryOnUnmounted(() => {
    removeVNode(vNode)
  })

  return {
    open: () => pushVNode(vNode),
    close: () => removeVNode(vNode),
  }
}

/** Convert Component Options to VNode */
export function c2v<T extends Component>(options: C2VOptions<T>) {
  return options
}

export function isC2VOptions<T extends Component>(value: unknown): value is C2VOptions<T> {
  if (typeof value === 'object' && value !== null)
    return 'component' in value
  else
    return false
}

export function getSlots<T extends Component>(slots: {
  [K in keyof ComponentSlots<T>]?: string | Component | C2VOptions<Component>
}) {
  return objectEntries(slots || {}).reduce((acc, cur) => {
    const slotName = cur[0] as string
    const slot = cur[1] as string | Component | C2VOptions<any>
    if (isString(slot))
      acc[slotName] = () => h('div', { innerHTML: slot })
    else if (isC2VOptions(slot))
      acc[slotName] = () => h(slot.component, slot.attrs, slot.slots ? getSlots(slot.slots) : undefined)
    else
      acc[slotName] = () => h(slot)
    return acc
  }, {} as Record<string, () => VNode>)
}
