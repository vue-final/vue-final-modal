import type { App, Component, MaybeRefOrGetter, VNode } from 'vue'
import type { ComponentProps, ComponentSlots } from 'vue-component-type-helpers'

type PickComponentEmits<T extends object> = {
  [K in keyof T as K extends `on${Capitalize<string>}` ? K : never]: T[K]
}
type PickComponentProps<T extends object> = {
  [K in keyof T as K extends `on${Capitalize<string>}` ? never : K]: T[K]
}

export interface Template<T extends Component> {
  component: T
  attrs?: MaybeRefOrGetter<ComponentProps<T>>
  emits?: MaybeRefOrGetter<PickComponentEmits<ComponentProps<T>>>
  props?: MaybeRefOrGetter<PickComponentProps<ComponentProps<T>>>
  /** A string slot is rendered as raw HTML, like `v-html`: never pass user-provided content as a string. */
  slots?: {
    [K in keyof ComponentSlots<T>]?: string | Component | Template<Component>
  }
}

export interface Provider {
  vNodeFns: Set<() => VNode>
}

export interface TemplateState {
  /** Provide this state to `app` and make it the active state, so `useTemplate()` resolves to it outside setup on the client. */
  install: (app: App) => void
  resolveProvider: () => Provider | undefined
}

export type UseTemplate = <T extends Component>(
  template: MaybeRefOrGetter<Template<T>>,
  options?: {
    showByDefault?: boolean
    hideOnUnmounted?: boolean
  },
) => {
  show: () => void
  hide: () => void
  /** `show()` does nothing: `useTemplate()` was called outside a component on the server. */
  ignored: boolean
}
