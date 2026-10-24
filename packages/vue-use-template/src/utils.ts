import type { Component, MaybeRefOrGetter, VNode } from 'vue'
import type { ComponentSlots } from 'vue-component-type-helpers'
import type { Template, TemplateAttrs } from './types'
import { h, toValue, unref } from 'vue'

export function isTemplate<T extends Component>(template: unknown): template is Template<T> {
  const _template = unref(template)
  if (typeof _template === 'object' && _template !== null)
    return 'component' in _template
  else
    return false
}

/**
 * A type helper to define a template
 */
export function defineTemplate<T extends Component, K extends keyof TemplateAttrs<T> = never>(template: Template<T, K>) {
  return template
}

/**
 * Create a vNode by passing `Template`.
 */
/** Takes a template with any attrs: its type was checked where it was defined. */
export function templateToVNodeFn<T extends Component>(template: MaybeRefOrGetter<Template<T, any>>): () => VNode {
  const key = Symbol('vNodeFnKey')
  return () => {
    const _template = unref(toValue(template))
    const attrs = mergeTemplateAttrs(_template)
    Object.assign(attrs, { key })
    return h(unref(_template.component), attrs, getSlots(unref(_template.slots)))
  }
}

function getSlots<T extends Component>(slots?: {
  [K in keyof ComponentSlots<T>]?: string | Component | Template<Component>
}) {
  /** An empty slots object still makes Vue force-update the component, so pass none at all. */
  if (!slots)
    return undefined
  return objectEntries(slots as Record<string, string | Component | Template<Component>>).reduce<Record<string, () => VNode>>((acc, cur) => {
    const slotName = cur[0] as string
    const slot = cur[1] as string | Component | Template<Component>
    if (typeof slot === 'string')
      acc[slotName] = () => h('div', { innerHTML: slot })
    else if (isTemplate(slot))
      acc[slotName] = () => h(slot.component, mergeTemplateAttrs(slot), slot.slots ? getSlots(slot.slots) : undefined)
    else
      acc[slotName] = () => h(slot)
    return acc
  }, {})
}

export function mergeTemplateAttrs<T extends Component>(template: MaybeRefOrGetter<Template<T, any>>) {
  const _template = toValue(template)
  return {
    ...unrefValues(toValue(_template?.attrs)),
    ...toValue(_template?.props),
    ...toValue(_template?.emits),
  }
}

/** Read in the render, so a ref given for an attr keeps the vNode in sync. */
function unrefValues(attrs: object | undefined) {
  return Object.fromEntries(Object.entries(attrs ?? {}).map(([name, value]) => [name, unref(value)]))
}

type Entries<T> = { [K in keyof T]: [K, T[K]] }[keyof T][]
/**
 * Type safe variant of `Object.entries()`
 */
function objectEntries<T extends Record<any, any>>(object: T): Entries<T> {
  return Object.entries(object) as any
}
