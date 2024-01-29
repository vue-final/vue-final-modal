import type { Component, VNode } from 'vue'
import { h as _h, isVNode } from 'vue'
import { tryOnUnmounted } from '@vueuse/core'
import type { CreateVNodeOptions } from './Modal'
import { useSsrVfm, useVfm } from './useVfm'
import type { ComponentSlots } from './Component'
import { isString, objectEntries } from './utils'

/**
 * Create a dynamic vNode.
 */
export function createVNode<T extends Component>(options: CreateVNodeOptions<T>) {
  const id = Symbol(__DEV__ ? 'createVNode' : '')
  const vNode = _h(options.component, { key: id, ...options.attrs }, getSlots(options.slots))
  return vNode
}

/**
 * Create a dynamic vNode.
 */
export function h<T extends Component>(options: CreateVNodeOptions<T>) {
  return options
}

async function pushVNode(vNode: VNode) {
  const vfm = await useSsrVfm()
  vfm.vNodesContainer.push(vNode)
}

async function removeVNode(vNode: VNode) {
  const vfm = useVfm()
  vfm.vNodesContainer.remove(vNode)
}

export function useVNode(vNode: VNode, options?: {
  tryOnUnmounted?: (vNode: VNode) => void
}) {
  tryOnUnmounted(() => options?.tryOnUnmounted?.(vNode))
  return {
    show: () => pushVNode(vNode),
    hide: () => removeVNode(vNode),
  }
}

export function isVNodeOptions<T extends Component>(value: unknown): value is CreateVNodeOptions<T> {
  if (typeof value === 'object' && value !== null)
    return 'component' in value
  else
    return false
}

export function getSlots<T extends Component>(slots?: {
  [K in keyof ComponentSlots<T>]?: string | Component | CreateVNodeOptions<Component>
}) {
  return objectEntries(slots || {}).reduce<Record<string, () => VNode>>((acc, cur) => {
    const slotName = cur[0] as string
    const slot = cur[1] as string | Component | CreateVNodeOptions<Component>
    if (isString(slot))
      acc[slotName] = () => _h('div', { innerHTML: slot })
    else if (isVNodeOptions(slot))
      acc[slotName] = () => _h(slot.component, slot.attrs, slot.slots ? getSlots(slot.slots) : undefined)
    else if (isVNode(slot))
      // acc[slotName] = () => slot
      return acc
    else
      acc[slotName] = () => _h(slot)
    return acc
  }, {})
}
