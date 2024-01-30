import type { Component, VNode } from 'vue'
import { computed, defineComponent, onBeforeUnmount, ref, shallowReactive } from 'vue'
import { tryOnUnmounted } from '@vueuse/core'
import { templateToVNode } from './composables/useTemplate'
import type { CreateContainer, Template, UseTemplate } from './types'

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
