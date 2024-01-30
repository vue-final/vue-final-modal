import type { Component } from 'vue'
import type { Template } from './Modal'

export type CreateContainer = {
  Container: Component
  useTemplate: UseTemplate
}

export type UseTemplate = <T extends Component>(
  template: Template<T>,
  options?: { onUnmounted?: (() => void) }
) => {
  show: () => Promise<void>
  hide: () => Promise<void>
}
