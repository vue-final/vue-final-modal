---
title: Introduction
description: 'Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.'
position: 0
category: Getting Start
version: 0.21
features:
  - Support Vue 3 and Vue 2
  - Tailwind CSS friendly
  - Renderless component
  - SSR support
  - Stackable
  - Detachable
  - Scrollable
  - Transition support
  - Mobile friendly
  - Tiny bundle size
  - Accessibility support
---

<img src="/preview.png" class="light-img" alt="Vue Final Modal Logo" />
<img src="/preview-dark.png" class="dark-img" alt="Vue Final Modal Logo" />

<p class="flex h-8 space-x-4">
  <a href="https://npmcharts.com/compare/vue-final-modal?minimal=true"><img src="https://badgen.net/npm/dm/vue-final-modal" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/vue-final-modal"><img src="https://img.shields.io/npm/l/vue-final-modal.svg?sanitize=true" alt="License"></a>
  <a href="https://app.netlify.com/sites/vue-final-modal/deploys"><img src="https://api.netlify.com/api/v1/badges/444b13a8-540f-4438-94da-80c865c8f103/deploy-status" alt="Netlify Status"></a>
</p>

<p class="flex h-8 space-x-4">
  <a href="https://www.npmjs.com/package/vue-final-modal"><img src="https://badgen.net/npm/v/vue-final-modal" alt="Version"></a>
  <a href="https://www.npmjs.com/package/vue-final-modal"><img src="https://badgen.net/badgesize/brotli/hunterliu1003/vue-final-modal/master/dist/VueFinalModal.umd.js" alt="Size"></a>
</p>

<p class="flex h-8 space-x-4">
  <a href="https://www.npmjs.com/package/vue-final-modal"><img src="https://badgen.net/npm/v/vue-final-modal/next" alt="Version"></a>
  <a href="https://www.npmjs.com/package/vue-final-modal"><img src="https://badgen.net/badgesize/brotli/hunterliu1003/vue-final-modal/next/dist/VueFinalModal.umd.js" alt="Size"></a>
</p>

<p align="right">
  <a href="https://www.buymeacoffee.com/PL2qJIx" target="_blank" rel="noopener noreferrer">
    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-green.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" >
  </a>
</p>

[Vue Final Modal](https://github.com/hunterliu1003/vue-final-modal) is a tiny, renderless, mobile-friendly, feature-rich modal component for Vue.js.<br />
You can create a [higher-order component](/examples/recommended-use) easily and can customize `template`, `script` and `style` based on your needs.

## Features

<list :items="features"></list>

<p class="flex items-center">Enjoy light and dark mode:&nbsp;<app-color-switcher class="p-2"></app-color-switcher></p>

## Installation

**Vue 3.0**

version `1.x`, `3.x` is for Vue 3.x.

<code-group>
  <code-block label="Yarn" active>

```bash
yarn add vue-final-modal@next
```

  </code-block>
  <code-block label="NPM">

```bash
npm install vue-final-modal@next
```

  </code-block>
</code-group>

**Vue 2.0**

version `0.x`, `2.x` is for Vue 2.x.

<code-group>
  <code-block label="Yarn" active>

```bash
yarn add vue-final-modal@latest
```

  </code-block>
  <code-block label="NPM">

```bash
npm install vue-final-modal@latest
```

  </code-block>
</code-group>

## Registeration

### Vue

```js[main.js]
import VueFinalModal from 'vue-final-modal'

Vue.use(VueFinalModal())
```

### Nuxt

- **Write a plugin `vue-final-modal.js`**

```js[plugins/vue-final-modal.js]
import VueFinalModal from 'vue-final-modal/lib'

Vue.use(VueFinalModal())
```

- **Add plugin into `nuxt.config.js`**

```js[nuxt.config.js]
export default {
  plugins: ['~plugins/vue-final-modal.js'],
  build: {
    transpile: ['vue-final-modal']
  }
}
```

### CDN

<alert>[Live demo](https://codepen.io/hunterliu1003/pen/ZEWoYeE)</alert>

- **jsDelivr**

```html
<script src="https://cdn.jsdelivr.net/npm/vue-final-modal"></script>
```

- **Unpkg**

```html
<script src="https://unpkg.com/vue-final-modal"></script>
```

## Basic usage

### **Click button to open modal**

```html
<vue-final-modal v-model="showModal">
  Modal Content Here
</vue-final-modal>

<button @click="showModal = true">Launch</button>
```

### **Open modal with API**

<alert>`v-model` is necessary when you open a modal with `$vfm.show(name)` API.</alert>

```html
<vue-final-modal v-model="showModal" name="example">
  Modal Content Here
</vue-final-modal>
```

```js
this.$vfm.show('example')
```

## **Configuration**

Configuration options can be passed as a second argument to `Vue.use`.

```js
import VueFinalModal from 'vue-final-modal'

Vue.use(VueFinalModal(), { ... })
```

### `componentName`

- Type: `String`
- default: `'VueFinalModal'`

Customize component name from `VueFinalModal` to any other string value.

### `key`

- Type: `String`
- default: `'$vfm'`

Customize API name from `$vfm` to any other string value. It is useful when you use `vue-final-modal` as spinner, toast, notify, etc.

### `dynamicContainerName`

- Type: `String`
- default: `'ModalsContainer'`

Customize dynamic modals container name from `ModalsContainer` to any other string value.

## **API**

- **Options API**

Plugin API can be called within any component through `this.$vfm`.

- **Composition API** <badge>Vue 3 only</badge>

```js
import { inject } from 'vue'

export default {
  setup() {
    const $vfm = inject('$vfm')
  }
}
```

### `$vfm.show(name, params)`

- Type: `Function`
- Arguments:
  - name: `String` - Name of the modal
  - params: `?: object` - Any data that you would want to pass into the modal (@before-open event handler will contain `params` in the event). You can also using scoped-slot to get params in template:

```html
<template v-slot="{ params }">
  <!-- modal content -->
</template>
```

Or get `params` on `@beforeOpen` event:

```html
<vue-final-modal @beforeOpen="e => e.ref.params">
  <!-- modal content -->
</vue-final-modal>
```

<alert>`parmas` will be reset to `{}` automatically after `closed` event. You can avoid the modal to reset the `params` to empty object by calling `event.stop()`.</alert>

- Example:

```html
<template>
  <vue-final-modal v-model="show" name="example">
    <template v-slot="{ params }">
      Hi {{ params.userName }}
    </template>
  </vue-final-modal>
</template>

<script>
  export default {
    data: () => ({
      show: false
    }),
    mounted() {
      this.$vfm.show('example', { userName: 'vue-final-modal' })
    }
  }
</script>
```

<alert>`v-model` is necessary when you open a modal with `$vfm.show(name)` API.</alert>

### `$vfm.hide([names])`

- Type: `Function`
- Arguments:
  - names: `String` - The names to hide
- Example:

```html
<template>
  <vue-final-modal v-model="show" name="example">Vue Final Modal is awesome</vue-final-modal>
  <vue-final-modal v-model="show2" name="example2">Vue Final Modal is awesome 2</vue-final-modal>
</template>

<script>
  export default {
    data: () => ({
      show: true,
      show2: true
    }),
    mounted() {
      this.$vfm.hide('example', 'example2')
    }
  }
</script>
```

### `$vfm.hideAll()`

hide all modals.

### `$vfm.toggle(name, show, params)`

- Type: `Function`
- Arguments:
  - name: [`String` | `Array`] - The names of the modal
  - show: `?: Boolean` - Show modal or not
  - params: `?: object` - Any data that you would want to pass into the modal (@before-open event handler will contain params in the event). You can also using scoped-slot to get params in template:

```html
<template v-slot="{ params }">
  <!-- modal content -->
</template>
```

Or get `params` on `@beforeOpen` event:

```html
<vue-final-modal @beforeOpen="e => e.ref.params">
  <!-- modal content -->
</vue-final-modal>
```

<alert>`parmas` will be reset to `{}` automatically after `closed` event. You can avoid the modal to reset the `params` to empty object by calling `event.stop()`.</alert>

toggle modals by name.

### `$vfm.get([names])`

- Type: `Function`
- Arguments:
  - names: `String` - Get the names of the modal instances
- Return:
  - `Array`: returns the modal instances

### `$vfm.openedModals`

- Return: 
  - `Array`: returns the opened modal instances.

- Examples:

1. `$vfm.openedModals[0]`: get the first opened modal instance.
2. `$vfm.openedModals.length`: get how many modals was opened.

### `$vfm.modals`

- Return:
  - `Array`: returns all modal instances.

## **Props**

### `name`

- Type: `String`
- Default: `null`

Modal name for global API `$vfm.show(name)`, `$vfm.hide(name)`, etc.

<alert>`v-model` is necessary when you open a modal with `$vfm.show(name)` API.</alert>

### `ssr`

- Type: `Boolean`
- Default: `true`

Use `v-if` (false) or `v-show` (true) to display the modal.

### `classes`

- Type: `[String, Object, Array]`
- Default: `''`

Custom class names for the modal container element.

### `contentClass`

- Type: `[String, Object, Array]`
- Default: `''`

Custom class names for the modal content element.

### `overlayClass`

- Type: `[String, Object, Array]`
- Default: `''`

Custom class names for the modal overlay element.

### `styles`

- Type: `[String, Object, Array]`
- Default: `''`

Style that will be applied to the modal container element.

### `contentStyle`

- Type: `[String, Object, Array]`
- Default: `''`

Style that will be applied to the modal content element.

### `overlayStyle`

- Type: `[String, Object, Array]`
- Default: `''`

Style that will be applied to the modal overlay element.

### `transition`

- Type: `String`
- Default: `'vfm'`

CSS transition applied to the modal container element.

Default transition:

```css
.vfm-enter-active,
.vfm-leave-active {
  transition: opacity 0.2s;
}
.vfm-enter,
.vfm-leave-to {
  opacity: 0;
}
```

### `overlayTransition`

- Type: `String`
- Default: `'vfm'`

CSS transition applied to the modal overlay element.

Default transition:

```css
.vfm-enter-active,
.vfm-leave-active {
  transition: opacity 0.2s;
}
.vfm-enter,
.vfm-leave-to {
  opacity: 0;
}
```

### `lockScroll`

- Type: `Boolean`
- Default: `true`

Disabled the scrolling of body while the modal is displayed.

### `hideOverlay`

- Type: `Boolean`
- Default: `false`

Hide the display of the overlay.

### `clickToClose`

- Type: `Boolean`
- Default: `true`

Clicking overlay of modal to close the modal.

### `escToClose`

- Type: `Boolean`
- Default: `false`

Press `esc` to close the modal.

### `preventClick`

- Type: `Boolean`
- Default: `false`

The click event will not be blocked by overlay.<br />
Set the root element of `vue-final-modal` style to `pointer-events: none;`.

### `attach`

- Type: `Any`
- Default: `false`

Specifies which DOM element that this component should detach to.

1. Set `false` will disabled this feature.
2. String can be any valid `querySelector`, e.g. `'body'`, `'#app'`.
3. Object can be any valid `Node`, e.g. `this.$refs.container`.

### `zIndexAuto`

- Type: `Boolean`
- Default: `true`

Auto binding `z-index` base on the prop `zIndexBase` and adding `2` by each stackable modal. If zIndex is set, `zIndexAuto`, `zIndexBase` will be ignored.

### `zIndexBase`

- Type: `[String, Number]`
- Default: `1000`

Calculate `z-index` automatically with zIndexBase. If zIndex is set, `zIndexAuto`, `zIndexBase` will be ignored.

### `zIndex`

- Type: `[String, Number]`
- Default: `false`

Set specific `z-index` to root of the modal element. If zIndex is set, `zIndexAuto`, `zIndexBase` will be ignored.

### `focusRetain`

- Type: `Boolean`
- Default: `true`

Focus the modal `vfm__container` after the modal enter.

### `focusTrap`

- Type: `Boolean`
- Default: `false`

Enables focus trap meaning that only inputs/buttons that are withing the modal window can be focused by pressing Tab (plugin uses very naive implementation of the focus trap).

## **Events**

### **Live example**

<v-events></v-events>

<show-code open class="pt-4">

```vue
<template>
  <vue-final-modal
    @click-outside="clickOutside"
    @before-open="beforeOpen"
    @opened="opened"
    @before-close="beforeClose"
    @closed="closed"
  >
    ...modal content
  </vue-final-modal>
</template>
```

</show-code>

### `@click-outside`

- Emits while modal container on click.

<alert>

If prop `clickToClose` is `false`, the event will still be emitted.

</alert>

### `@before-open`

- Emits while modal is still invisible, but before transition starting. Further opening of the modal can be blocked from this event listener by calling `event.stop()`.

### `@opened`

- Emits after modal became visible and transition ended.

### `@before-close`

- Emits before modal is going to be closed. Further closing of the modal can be blocked from this event listener by calling `event.stop()`.

### `@closed`

- Emits right before modal is destroyed. Further after the modal was closed, you can avoid the modal to reset the `params` to empty object by calling `event.stop()`.

## **Slots**

If you open a modal though API `$vfm.show(name, params)`, You can using scoped-slot to get `params` in template:

```html
<template v-slot="{ params }">
  <!-- modal content -->
</template>
```

Or get `params` on `@beforeOpen` event:

```html
<vue-final-modal @beforeOpen="e => e.ref.params">
  <!-- modal content -->
</vue-final-modal>
```

<alert>`parmas` will be reset to `{}` automatically after `closed` event. You can avoid the modal to reset the `params` to empty object by calling `event.stop()`.</alert>

## TypeScript

### Vue

Works out of the box in Vue, no other settings are required. But if you customized your access key, you must define the type yourself like below:

```ts
import Vue from 'vue'
import VueFinalModal, { VfmOptions, VueFinalModalProperty } from 'vue-final-modal'

Vue.use<VfmOptions>(VueFinalModal(), {
  componentName: 'MyComponentName',
  key: 'myKey'
})

// define the type of access key yourself
declare module 'vue/types/vue' {
  interface Vue {
    myKey: VueFinalModalProperty
  }
}
```

### Nuxt

Add the types to your "types" array in tsconfig.json file

```js
{
  "compilerOptions": {
    "types": [
      // other types
      // ...
      "vue-final-modal"
    ]
  }
}
```

## **Contribution**

👋 Hi I'm Hunter, the author of `vue-final-modal`.

To develop vue-final-modal, I learn a lot from these awesome libraries:

- [Vuetify](https://vuetifyjs.com/en/)
  - attach
- [Element UI](https://element.eleme.io/)
  - stackable modal
  - zIndex
  - zIndexBase
- [vue-js-modal](https://github.com/euvl/vue-js-modal)
  - dynamic modal
  - transition
  - focusTrap for A11y
- [Bootstrap Vue](https://bootstrap-vue.org/)
  - lockScroll

<alert>There is no perfect library even the `final` of vue modal.</alert>

🚀 If you have any ideas for optimization of `vue-final-modal`, feel free to open [issues](https://github.com/hunterliu1003/vue-final-modal/issues) or [pull requests](https://github.com/hunterliu1003/vue-final-modal/pulls).
