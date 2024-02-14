import type { Component, VNode } from 'vue'
import { computed, defineComponent, h, onBeforeUnmount, ref, shallowReactive } from 'vue'
import { tryOnUnmounted } from '@vueuse/core'
import type { CreateContainer, Template, UseTemplate } from './types'
import type { ComponentSlots } from '~/types'
import { isString, objectEntries } from '~/utils'

export function createContainer(options?: { name?: string }): CreateContainer {
  const vNodes: VNode[] = shallowReactive([])
  const containers = ref<symbol[]>([])
  const name = options?.name || 'Container'

  const Container = defineComponent({
    name,
    setup() {
      const uid = Symbol(__DEV__ ? name : '')
      const shouldMount = computed(() => uid === containers.value?.[0])

      containers.value.push(uid)
      onBeforeUnmount(() => {
        containers.value = containers.value.filter(i => i !== uid)
      })

      return () => shouldMount.value ? vNodes : null
    },
  })

  function pushVNode(vNode: VNode) {
    if (!vNodes.includes(vNode))
      vNodes.push(vNode)
  }

  function deleteVNode(vNode: VNode): void {
    const index = vNodes.indexOf(vNode)
    if (index !== undefined && index !== -1)
      vNodes.splice(index, 1)
  }

  const useTemplate: UseTemplate = <T extends Component>(template: Template<T>, options?: {
    onUnmounted?: () => void
  }) => {
    if (template.attrs)
      Object.assign(template.attrs, { key: Symbol(__DEV__ ? 'vNodeId' : '') })

    const vNode = templateToVNode(template)
    const show = async () => pushVNode(vNode)
    const hide = async () => deleteVNode(vNode)

    tryOnUnmounted(() => options?.onUnmounted ? options.onUnmounted() : hide())

    return { show, hide }
  }

  return {
    Container,
    useTemplate,
  }
}

/**
 * Create a vNode by passing template.
 */
export function templateToVNode<T extends Component>(template: Template<T>): VNode {
  return h(template.component, template.attrs, getSlots(template.slots))
}

/**
 * A type helper to define a template
 */
export function defineTemplate<T extends Component>(template: Template<T>) {
  return template
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
      acc[slotName] = () => h('div', { innerHTML: slot })
    else if (isTemplate(slot))
      acc[slotName] = () => h(slot.component, slot.attrs, slot.slots ? getSlots(slot.slots) : undefined)
    else
      acc[slotName] = () => h(slot)
    return acc
  }, {})
}
