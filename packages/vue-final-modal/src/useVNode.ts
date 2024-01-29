import type { Component, VNode } from 'vue'
import { h as _h } from 'vue'
import { tryOnUnmounted } from '@vueuse/core'
import type { CreateVNodeOptions } from './Modal'
import { useSsrVfm, useVfm } from './useVfm'
import type { ComponentSlots } from './Component'
import { isString, objectEntries } from './utils'

/**
 * Create a vNode by passing `CreateVNodeOptions<T>` options.
 */
export function createVNode<T extends Component>(options: CreateVNodeOptions<T>) {
  return _h(options.component, options.attrs, getSlots(options.slots))
}

/**
 * A type helper for `CreateVNodeOptions<T>`
 */
export function h<T extends Component>(options: CreateVNodeOptions<T>) {
  return options
}

export function useVNode<T extends Component>(vNodeOptions: CreateVNodeOptions<T>, options?: {
  onUnmounted?: (vNode: VNode) => void
}) {
  if (vNodeOptions.attrs) {
    const id = Symbol(__DEV__ ? 'createVNode' : '')
    Object.assign(vNodeOptions.attrs, { key: id })
  }
  const vNode = createVNode(vNodeOptions)
  tryOnUnmounted(() => {
    if (options?.onUnmounted)
      options?.onUnmounted(vNode)
    else
      hide()
  })

  async function show() {
    const vfm = await useSsrVfm()
    vfm.vNodesContainer.push(vNode)
  }

  async function hide() {
    const vfm = useVfm()
    vfm.vNodesContainer.remove(vNode)
  }

  return {
    show,
    hide,
  }
}

export function isVNodeOptions<T extends Component>(value: unknown): value is CreateVNodeOptions<T> {
  if (typeof value === 'object' && value !== null)
    return 'component' in value
  else
    return false
}

function getSlots<T extends Component>(slots?: {
  [K in keyof ComponentSlots<T>]?: string | Component | CreateVNodeOptions<Component>
}) {
  return objectEntries(slots || {}).reduce<Record<string, () => VNode>>((acc, cur) => {
    const slotName = cur[0] as string
    const slot = cur[1] as string | Component | CreateVNodeOptions<Component>
    if (isString(slot))
      acc[slotName] = () => _h('div', { innerHTML: slot })
    else if (isVNodeOptions(slot))
      acc[slotName] = () => _h(slot.component, slot.attrs, slot.slots ? getSlots(slot.slots) : undefined)
    else
      acc[slotName] = () => _h(slot)
    return acc
  }, {})
}
