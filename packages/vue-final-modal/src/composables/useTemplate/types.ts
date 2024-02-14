import type { Component } from 'vue'
import type { ComponentProps, ComponentSlots } from '~/types'

export type Template<T extends Component> = {
  component: T
  attrs?: ComponentProps<T>
  slots?: {
    [K in keyof ComponentSlots<T>]?: string | Component | Template<Component>
  }
}

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
