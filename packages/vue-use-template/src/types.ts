import type { App, Component, MaybeRef, MaybeRefOrGetter, Ref, VNode } from 'vue'
import type { ComponentProps, ComponentSlots } from 'vue-component-type-helpers'

type PickComponentEmits<T extends object> = {
  [K in keyof T as K extends `on${Capitalize<string>}` ? K : never]: T[K]
}
type PickComponentProps<T extends object> = {
  [K in keyof T as K extends `on${Capitalize<string>}` ? never : K]: T[K]
}
type RequiredKeys<P> = { [K in keyof P]-?: object extends Pick<P, K> ? never : K }[keyof P]
type TemplateData<T extends Component> = PickComponentProps<ComponentProps<T>>

/** The props declared as a ref itself, `any` aside: attrs would unwrap the ref, so they go in props. */
type RefPropKeys<P> = { [K in keyof P]-?: 0 extends 1 & P[K] ? never : [NonNullable<P[K]>] extends [Ref] ? K : never }[keyof P]

/** The attrs of a template: any of the component's props but the refs themselves, each one also as a ref. */
export type TemplateAttrs<T extends Component> = Partial<{ [K in Exclude<keyof ComponentProps<T>, RefPropKeys<ComponentProps<T>>>]: MaybeRef<ComponentProps<T>[K]> }>

type MissingProps<T extends Component, K extends PropertyKey> = Pick<TemplateData<T>, Exclude<RequiredKeys<TemplateData<T>>, K>>

/**
 * The props of a template whose attrs give the props `K`: they have to give each required prop that `K` leaves out.
 * Asks whether no props at all would do, inside tuples: a component of an untyped JavaScript module is an `any` that
 * a conditional type checking it directly gives back as is.
 */
export type TemplateProps<T extends Component, K extends PropertyKey> = [Record<never, never>] extends [MissingProps<T, K>]
  ? { props?: MaybeRefOrGetter<Partial<TemplateData<T>>> }
  : { props: MaybeRefOrGetter<Partial<TemplateData<T>> & MissingProps<T, K>> }

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
    /** `false`: never rendered on the server, and in the browser only once hydration has finished. */
    ssr?: boolean
  },
) => {
  show: () => void
  hide: () => void
  /** `show()` does nothing: `useTemplate()` was called on the server outside a component, or with `ssr: false`. */
  ignored: boolean
}
