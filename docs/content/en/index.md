---
title: Introduction
description: 'Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.'
position: 0
category: Getting Start
version: 0.19
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

<code-group>
  <code-block label="Yarn" active>

```bash
yarn add vue-final-modal
```

  </code-block>
  <code-block label="NPM">

```bash
npm install vue-final-modal
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
  plugins: [
    '~plugins/vue-final-modal.js'
  ],
  build: {
    transpile: ['vue-final-modal'],
  }
}
```

### CDN

> [Live demo](https://codepen.io/hunterliu1003/pen/ZEWoYeE)

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

```html
<vue-final-modal v-model="showModal" name="example">
  Modal Content Here
</vue-final-modal>
```

```js
this.$vfm.show('example')
```

## **Configuration**

<badge>v0.18+</badge>

Configuration options can be passed as a second argument to `Vue.use`.

```js
import VueFinalModal from 'vue-final-modal'

Vue.use(VueFinalModal(), { ... })
```

### `componentName`

- Type: `String`
- default: `'VueFinalModal'`

Changes component name from "VueFinalModal" to any other string value. It is useful when there is already a global "modal" component.

### `key`

- Type: `String`
- default: `'$vfm'`

Changes API name from "$vfm" to any other string value. It is useful when you use `vue-final-modal` as spinner, toast, notify, etc.

## **API**

<badge>v0.15+</badge>

Plugin API can be called within any component through `this.$vfm`.

### `$vfm.openedModals`

- Type: `Array`

A stack array store the opened modal's vue component instance.

You can use:
1. `$vfm.openedModals[0]` to get the first opened modal instance.
2. `$vfm.openedModals.length` to get how many modals is opened.

### `$vfm.modals`

- Type: `Array`

All modal instances include show and hide.

### `$vfm.show(name)`

- Type: `Function`
- Arguments:
  - name: `String` - Name of the modal
- Example:

```html
<template>
    <vue-final-modal v-model="show" name="example">Vue Final Modal is awesome</vue-final-modal>
</template>

<script>
export default {
    name: 'MyComponent',
    data: () => ({
      show: false
    }),
    mounted () {
        this.$vfm.show('example')
    }
}
</script>
```

### `$vfm.hide(name)`

- Type: `Function`
- Arguments:
  - name: `String` - Name of the modal
- Example:

```html
<template>
    <vue-final-modal v-model="show" name="example">Vue Final Modal is awesome</vue-final-modal>
</template>

<script>
export default {
    name: 'MyComponent',
    data: () => ({
      show: true
    }),
    mounted () {
        this.$vfm.hide('example')
    }
}
</script>
```

### `$vfm.hideAll()`

hide all modals.

### `$vfm.toggle(name, show)`

- Type: `Function`
- Arguments:
  - name: `String` - Name of the modal
  - show: `Boolean` - Show modal or not

toggle modal by name.

## **Props**

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
<badge>v0.17+</badge><badge>v1.4+</badge>

- Type: `[String, Object, Array]`
- Default: `''`

Style that will be applied to the modal container element.

### `contentStyle`
<badge>v0.17+</badge><badge>v1.4+</badge>

- Type: `[String, Object, Array]`
- Default: `''`

Style that will be applied to the modal content element.

### `overlayStyle`
<badge>v0.17+</badge><badge>v1.4+</badge>

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

<badge>v0.19+</badge>

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

### `zIndexBase`

- Type: `[String, Number]`
- Default: `1000`

Calculate `z-index` automatically with zIndexBase. If zIndex is set, `zIndexBase` will become invalid.

### `zIndex`

- Type: `[String, Number]`
- Default: `false`

Set specific `z-index` to root of the modal element. If zIndex is set, `zIndexBase` will become invalid.

### `focusRemain`

<badge>v0.19+</badge>

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

<badge>v0.14+</badge>

- Emits while modal container on click.

<alert>

If prop `clickToClose` is `false`, the event will still be emitted.

</alert>

### `@before-open`

- Emits while modal is still invisible, but before transition starting.

### `@opened`

- Emits after modal became visible and transition ended. 

### `@before-close`

- Emits before modal is going to be closed. 

### `@closed`

- Emits right before modal is destroyed.

## Contribution

If you have any ideas for optimization of `vue-final-modal`, feel free to open [issues](https://github.com/hunterliu1003/vue-final-modal/issues) or [pull request](https://github.com/hunterliu1003/vue-final-modal/pulls).
