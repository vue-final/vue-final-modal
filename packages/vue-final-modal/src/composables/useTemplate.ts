import type { Component, VNode } from 'vue'
import { h as _h } from 'vue'
import { useSsrVfm, useVfm } from '~/composables/useVfm'
import { isString, objectEntries } from '~/utils'
import type { ComponentSlots, Template, UseTemplate } from '~/types'

/**
 * Create a vNode by passing template.
 */
export function templateToVNode<T extends Component>(template: Template<T>): VNode {
  return _h(template.component, template.attrs, getSlots(template.slots))
}

/**
 * A type helper to define a template
 */
export function defineTemplate<T extends Component>(template: Template<T>) {
  return template
}

export const useTemplate: UseTemplate = <T extends Component>(template: Template<T>, options?: {
  onUnmounted?: () => void
}) => {
  let _template: undefined | ReturnType<UseTemplate>

  async function show() {
    if (!_template) {
      const { useTemplate } = await useSsrVfm()
      _template = useTemplate?.(template, options)
    }
    _template?.show()
  }

  async function hide() {
    if (!_template) {
      const { useTemplate } = useVfm()
      _template = useTemplate?.(template, options)
    }
    _template?.hide()
  }

  return { show, hide }
}

export function isTemplate<T extends Component>(value: unknown): value is Template<T> {
  if (typeof value === 'object' && value !== null)
    return 'component' in value
  else
    return false
}

function getSlots<T extends Component>(slots?: {
  [K in keyof ComponentSlots<T>]?: string | Component | Template<Component>
}) {
  return objectEntries(slots || {}).reduce<Record<string, () => VNode>>((acc, cur) => {
    const slotName = cur[0] as string
    const slot = cur[1] as string | Component | Template<Component>
    if (isString(slot))
      acc[slotName] = () => _h('div', { innerHTML: slot })
    else if (isTemplate(slot))
      acc[slotName] = () => _h(slot.component, slot.attrs, slot.slots ? getSlots(slot.slots) : undefined)
    else
      acc[slotName] = () => _h(slot)
    return acc
  }, {})
}
