import type { App, Component, MaybeRef, MaybeRefOrGetter, VNode } from 'vue'
import type { ComponentProps, ComponentSlots } from 'vue-component-type-helpers'

type PickComponentEmits<T extends object> = {
  [K in keyof T as K extends `on${Capitalize<string>}` ? K : never]: T[K]
}
type PickComponentProps<T extends object> = {
  [K in keyof T as K extends `on${Capitalize<string>}` ? never : K]: T[K]
}
type RequiredKeys<P> = { [K in keyof P]-?: object extends Pick<P, K> ? never : K }[keyof P]
type TemplateData<T extends Component> = PickComponentProps<ComponentProps<T>>

/** The attrs of a template: any of the component's props, each one also as a ref. */
export type TemplateAttrs<T extends Component> = Partial<{ [K in keyof ComponentProps<T>]: MaybeRef<ComponentProps<T>[K]> }>

/** The props of a template whose attrs give the props `K`: they have to give each required prop that `K` leaves out. */
export type TemplateProps<T extends Component, K extends PropertyKey> = [Exclude<RequiredKeys<TemplateData<T>>, K>] extends [never]
  ? { props?: MaybeRefOrGetter<Partial<TemplateData<T>>> }
  : { props: MaybeRefOrGetter<Partial<TemplateData<T>> & Pick<TemplateData<T>, Exclude<RequiredKeys<TemplateData<T>>, K>>> }

/** `K` is inferred from the names given in attrs, so that props only has to give the required props they leave out. */
export type Template<T extends Component, K extends keyof TemplateAttrs<T> = keyof TemplateAttrs<T>> = {
  component: T
  attrs?: MaybeRefOrGetter<{ [P in K]?: TemplateAttrs<T>[P] }>
  emits?: MaybeRefOrGetter<PickComponentEmits<ComponentProps<T>>>
  /** A string slot is rendered as raw HTML, like `v-html`: never pass user-provided content as a string. */
  slots?: {
    [S in keyof ComponentSlots<T>]?: string | Component | Template<Component>
  }
} & TemplateProps<T, K>

export interface Provider {
  vNodeFns: Set<() => VNode>
}

export interface TemplateState {
  /** Provide this state to `app` and make it the active state, so `useTemplate()` resolves to it outside setup on the client. */
  install: (app: App) => void
  resolveProvider: () => Provider | undefined
}

export type UseTemplate = <T extends Component, K extends keyof TemplateAttrs<T> = never>(
  template: MaybeRefOrGetter<Template<T, K>>,
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
