# vue-use-template

## Playground

- [Stackblitz for Vue 3](https://stackblitz.com/github/hunterliu1003/vue-use-template/tree/master/examples/vue3)
- [Stackblitz for Nuxt](https://stackblitz.com/github/hunterliu1003/vue-use-template/tree/master/examples/nuxt)

## Install

```sh
pnpm add vue-use-template
```

`vue` and `vue-component-type-helpers` are peer dependencies. `vue-component-type-helpers` is only used for types.

## Usage

Render `TemplateProvider` once, around the rest of the app; it usually wraps `<RouterView />` or `<NuxtPage />`. It renders the templates shown with `useTemplate()` after its own content.

### App.vue

<!-- source: cypress/components/App.vue -->
```vue
<script setup lang="ts">
import { defineAsyncComponent, h, reactive, ref } from 'vue'
import { defineTemplate, TemplateProvider, useTemplate } from 'vue-use-template'

const confirmed = ref(false)
const props = reactive({
  title: 'Hello World!',
})

const { show, hide } = useTemplate({
  component: defineAsyncComponent(() => import('./DialogConfirm.vue')),
  props,
  emits: {
    onConfirm: () => {
      confirmed.value = true
      hide()
    },
    onCancel: () => hide(),
  },
  slots: {
    default: defineTemplate({
      component: () => h('p', 'This is a dialog content.'),
    }),
  },
})
</script>

<template>
  <TemplateProvider>
    <button @click="show()">
      Open dialog
    </button>
    <p v-if="confirmed">
      Confirmed!
    </p>
  </TemplateProvider>
</template>
```

`DialogConfirm` is an async component, so it loads the first time it is shown. `props` is reactive, so changing `props.title` updates the open dialog.

### DialogConfirm.vue

<!-- source: cypress/components/DialogConfirm.vue -->
```vue
<script setup lang="ts">
defineProps<{
  title: string
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <dialog open>
    <h1>{{ title }}</h1>
    <slot />
    <button @click="emit('confirm')">
      Confirm
    </button>
    <button @click="emit('cancel')">
      Cancel
    </button>
  </dialog>
</template>
```

## API

### `TemplateProvider`

A component that renders its default slot, then every shown template in the order they were shown. Every `TemplateProvider` renders all templates shown with `useTemplate()`, so render it once. In an app that installed a template state (see [`createTemplateProvider()`](#createtemplateprovider)), it renders that state's templates instead.

### `useTemplate(template, options?)`

Returns `{ show, hide, ignored }`: `show()` renders `template` in `TemplateProvider` and `hide()` removes it. Calling `show()` while the template is shown does nothing. `ignored` is `true` when `show()` will do nothing because `useTemplate()` was called outside a component on the server (see [SSR](#ssr)), so a caller can skip `show()` and its warning.

`template` is a [`Template`](#template), given as a plain object, a `ref`, a `reactive` object, a `computed` or a getter. A shown template re-renders when reactive state it reads changes. When `template` is a `ref` or a `reactive` object, wrap its component in `markRaw()`; otherwise Vue makes the component reactive and warns.

`options`:

- `showByDefault` (default `false`): show the template right away.
- `hideOnUnmounted` (default `true`): hide the template when the component that called `useTemplate()` unmounts.

Call `useTemplate()` in `setup()` or `<script setup>`, or on the client outside any component, for example in a store (`hideOnUnmounted` then has no effect). Outside a component it uses the template state installed last, if any. On the server, call it in `setup()` (see [SSR](#ssr)).

### `createTemplateProvider()`

Returns a new `{ TemplateProvider, useTemplate, install }` set with its own shown templates: its `TemplateProvider` renders only the templates shown with its `useTemplate()`. Create one to render a group of templates in another place, to keep a library's templates apart from the app's, or to start each test with nothing shown.

```ts
import { createTemplateProvider } from 'vue-use-template'

export const { TemplateProvider: ToastProvider, useTemplate: useToast } = createTemplateProvider()
```

It is also a Vue plugin. `app.use(createTemplateProvider())` gives that app its own templates: the package's `TemplateProvider` and `useTemplate()` resolve to it inside that app, and on the client `useTemplate()` called outside any component resolves to the state installed last. Install one per app to keep several apps on one page apart.

### Building blocks for libraries

The pieces `TemplateProvider` and `useTemplate()` are made of, for libraries that place the outlet themselves or resolve their own instances:

- `createTemplateState()`: a set of shown templates, kept apart per server render, with `install(app)` and `resolveProvider()`.
- `createUseTemplate(state)`: a `useTemplate()` bound to `state`.
- `createTemplateOutlet(state)`: a component that renders the templates of `state`, wherever it is placed.
- `createProvider()`: an empty `Provider`.
- `isBrowser()`: whether code outside a component runs in a browser, the same check `useTemplate()` makes there: `window` exists and `markServer()` was not called.
- `createInstanceResolver(key)`: returns `{ resolve(explicit?), setActive(instance) }`. `resolve()` returns `explicit` if given, then the instance injected with `key` (in `setup()` or `app.runWithContext()`), then, on the client only, the active instance. On the server it never falls back to the active instance, which every concurrent request shares.

### `Template`

The object that describes what to render:

- `component`: the component, for example an SFC, an async component or a functional component.
- `props`: its props, without `on*` listeners.
- `emits`: its event listeners, keyed `on` plus the capitalized event name: `onConfirm` listens to `emit('confirm')`.
- `attrs`: props, listeners, `class` and `style` in one object.
- `slots`: the content of each slot, by slot name. Slot content is one of:
  - a string, rendered as raw HTML inside a `<div>` (see [String slots](#string-slots))
  - a component, rendered without props
  - a nested `Template`, which can have slots of its own

`attrs`, `props` and `emits` can each be a plain object, a `reactive` object, a `ref`, a `computed` or a getter. They are merged in that order: `props` override `attrs`, and `emits` override both. Slot props are not passed to slot content.

### `defineTemplate(template)`

Returns `template` unchanged. It infers the component type from `component`, so `attrs`, `props` and `emits` are type-checked against that component. Use it for nested templates in `slots`, which are not type-checked otherwise, or to get the same checks on a template declared on its own.

### `templateToVNodeFn(template)`

Returns a function that creates a VNode from the template's current values each time it is called; `TemplateProvider` renders shown templates this way. `template` takes the same forms as in `useTemplate()`. Use it to render a template yourself, for example in a render function.

### `mergeTemplateAttrs(template)`

Resolves `attrs`, `props` and `emits` (refs, computeds and getters included) and merges them into a new object, in that order. This is how `templateToVNodeFn()` builds the component's props. `template` takes the same forms as in `useTemplate()`.

### `isTemplate(value)`

A type guard for `Template`: `true` for an object with a `component` key, also when it is wrapped in a `ref`, a `computed` or a `reactive` object. It never calls a function, so a getter or a functional component returns `false`.

### Types

- `Template<T>`: a template for component `T` (see [`Template`](#template)).
- `UseTemplate`: the type of `useTemplate()`, including the one `createTemplateProvider()` returns.
- `Provider`: `{ vNodeFns: Set<() => VNode> }`, the shown templates a `TemplateProvider` renders in one place, with one VNode function per shown template.
- `TemplateState`: what `createTemplateState()` returns.
- `InstanceResolver<T>`: what `createInstanceResolver()` returns.

## String slots

A string slot is rendered as raw HTML inside a `<div>`, the same as [`v-html`](https://vuejs.org/api/built-in-directives.html#v-html). Rendering arbitrary HTML can easily lead to XSS attacks, so only use string slots for trusted content and never for user-provided content. To render untrusted text, pass a component instead:

```ts
useTemplate({
  component: DialogConfirm,
  slots: {
    default: () => h('p', userProvidedText),
  },
})
```

## SSR

Templates shown while components set up (`showByDefault: true`, or `show()` called synchronously in `setup`) are rendered into the server HTML and hydrated on the client without mismatches. Every server render keeps its own templates, so nothing leaks between requests.

`<TemplateProvider>` renders its templates after its default slot, and on the server it does not wait for an `await` in that slot. These templates are rendered on the client only, after hydration:

- templates shown after an `await` in the async `setup` of a component inside `<TemplateProvider>`
- templates shown by a component that renders after `<TemplateProvider>` (instead of inside or around it)

To get a template that depends on fetched data into the server HTML, fetch the data before the page sets up, for example in Nuxt route middleware, and show the template synchronously in `setup`.

A component around `<TemplateProvider>`, such as the root component or a layout, renders it only after its own `setup` finishes, so it can show a template after an `await` and still have it rendered on the server. It has to call `useTemplate()` before the `await`, or use `<script setup>`, where Vue restores the current component after each top-level `await`. When a hand-written `async setup()` calls `useTemplate()` after an `await`, the template is rendered on the client only, after hydration.

On the server, `show()` from a `useTemplate()` called outside a component (for example in Nuxt route middleware, in a plugin, in a store or after an `await` in a hand-written `async setup()`) is ignored and, outside production, logs a warning. A server that defines `window`, for example with jsdom or happy-dom, looks like a browser to vue-use-template, so call `markServer()` once when it starts, before it renders. `markServer()` applies to the whole process: a test that simulates a server and a browser in one process needs a separate copy of vue-use-template for each side, for example by inlining it with Vitest's `server.deps.inline`. Concurrent requests share every module-level variable, so guessing the request could render one user's template into another user's page. On the client, such a template waits until hydration has finished instead of causing a hydration mismatch.

A component loaded with `defineAsyncComponent()`, such as a Nuxt `Lazy` component, should not show a template while it sets up. Once the server has loaded it, the server renders the template, but the browser hydrates before it has loaded the component, so Vue reports a hydration mismatch. Import such a component normally instead.
