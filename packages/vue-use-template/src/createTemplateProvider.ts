import type { App, Component, InjectionKey, MaybeRefOrGetter, Ref, VNode } from 'vue'
import type { Provider, Template, TemplateState, UseTemplate } from './types'
import { defineComponent, getCurrentInstance, h, hasInjectionContext, inject, onMounted, onUnmounted, ref, shallowReactive, ssrContextKey, warn } from 'vue'
import { createInstanceResolver, isBrowser, isClient } from './createInstanceResolver'
import { templateToVNodeFn } from './utils'

const templateStateKey: InjectionKey<TemplateState> = /* @__PURE__ */ Symbol('vue-use-template')
const stateResolver = /* @__PURE__ */ createInstanceResolver(templateStateKey)

export function resolveInstalledTemplateState(): TemplateState | undefined {
  return stateResolver.resolve()
}

export function createProvider(): Provider {
  return {
    vNodeFns: shallowReactive(new Set()),
  }
}

/** The browser-only providers of createTemplateState(): on the server, a template shown outside a component has no provider. */
const clientProviders = /* @__PURE__ */ new WeakSet<Provider>()

export function createTemplateState(): TemplateState {
  const clientProvider = createProvider()
  clientProviders.add(clientProvider)
  /** Keyed by SSR context rather than app: every render gets a fresh context, even when an app is reused across requests. */
  const serverProviders = new WeakMap<object, Provider>()

  const state: TemplateState = {
    install(app: App) {
      app.provide(templateStateKey, state)
      stateResolver.setActive(state)
    },
    resolveProvider() {
      /** The SSR context, not `window`, tells a server render apart: some servers polyfill `window`. */
      const ssrContext = hasInjectionContext() ? inject(ssrContextKey, null) : null
      /** Outside a component, `window` alone cannot tell a browser from a server that polyfills it. */
      if (!ssrContext)
        return (getCurrentInstance() ? isClient : isBrowser()) ? clientProvider : undefined

      let provider = serverProviders.get(ssrContext)
      if (!provider) {
        provider = createProvider()
        serverProviders.set(ssrContext, provider)
      }
      return provider
    },
  }
  return state
}

/** Outlets leave these out while hydrating, to match the server HTML, and render them once mounted. */
const ignoredOnServer = /* @__PURE__ */ new WeakSet<() => VNode>()

function useHydrating(): Ref<boolean> {
  /** A vnode mounted again keeps the detached element of its previous mount. */
  const hydrating = ref(Boolean(getCurrentInstance()?.vnode.el?.isConnected))
  if (hydrating.value) {
    onMounted(() => {
      hydrating.value = false
    })
  }
  return hydrating
}

function renderTemplates(provider: Provider | undefined, hydrating: Ref<boolean>) {
  const vNodeFns = [...(provider?.vNodeFns ?? [])]
  const rendered = hydrating.value ? vNodeFns.filter(vNodeFn => !ignoredOnServer.has(vNodeFn)) : vNodeFns
  return rendered.map(vNodeFn => vNodeFn())
}

export function createTemplateProviderComponent(getState: () => TemplateState) {
  return defineComponent({
    name: 'TemplateProvider',
    setup(_props, { slots }) {
      const provider = getState().resolveProvider()
      const hydrating = useHydrating()
      /** A separate component rendered after the slot, so templates shown while the slot sets up are already registered on the server and while hydrating. */
      const TemplateOutlet = () => renderTemplates(provider, hydrating)
      return () => [slots.default?.(), h(TemplateOutlet)]
    },
  })
}

/** Render the templates of `state` anywhere in the tree, for libraries that place the outlet themselves. */
export function createTemplateOutlet(state: TemplateState) {
  return defineComponent({
    name: 'TemplateOutlet',
    setup() {
      const provider = state.resolveProvider()
      const hydrating = useHydrating()
      return () => renderTemplates(provider, hydrating)
    },
  })
}

export function createUseTemplateFrom(getState: () => TemplateState): UseTemplate {
  return <T extends Component>(
    template: MaybeRefOrGetter<Template<T>>,
    { showByDefault = false, hideOnUnmounted = true }: Parameters<UseTemplate>[1] = {},
  ): ReturnType<UseTemplate> => {
    const provider = getState().resolveProvider()
    const vNodeFn = templateToVNodeFn(template)
    if (!getCurrentInstance() && provider && clientProviders.has(provider))
      ignoredOnServer.add(vNodeFn)

    function show() {
      if (provider)
        provider.vNodeFns.add(vNodeFn)
      else
        warn('vue-use-template: show() is ignored because useTemplate() was called outside a component on the server.')
    }

    function hide() {
      provider?.vNodeFns.delete(vNodeFn)
    }

    if (showByDefault)
      show()

    if (hideOnUnmounted && getCurrentInstance())
      onUnmounted(hide)

    return { show, hide, ignored: !provider }
  }
}

export function createUseTemplate(state: TemplateState): UseTemplate {
  return createUseTemplateFrom(() => state)
}

export function createTemplateProvider() {
  const state = createTemplateState()
  return {
    TemplateProvider: createTemplateProviderComponent(() => state),
    useTemplate: createUseTemplate(state),
    install: state.install,
  }
}
