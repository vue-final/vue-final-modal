import type { Ref, VNode } from 'vue'
import { ref, shallowReactive } from 'vue'

export type H = {
  vNodes: VNode[]
  containers: Ref<symbol[]>
  push: (vNode: VNode) => void
  remove: (vNode: VNode) => void
}

export function createH(): H {
  const vNodes: VNode[] = shallowReactive([])
  const containers = ref<symbol[]>([])

  function push(vNode: VNode) {
    if (!vNodes.includes(vNode))
      vNodes.push(vNode)
  }

  function remove(vNode: VNode): void {
    const index = vNodes.indexOf(vNode)
    if (index !== undefined && index !== -1)
      vNodes.splice(index, 1)
  }

  const _h: H = {
    vNodes,
    containers,
    push,
    remove,
  }
  return _h
}
