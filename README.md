# Vue Final Modal

<p align="center"><a href="https://vue-final-modal.org" target="_blank" rel="noopener noreferrer"><img src="https://vue-final-modal.org/preview.png" alt="Vue Final Modal Logo"></a></p>

<p align="center">
  <a href="https://npmcharts.com/compare/vue-final-modal?minimal=true"><img src="https://badgen.net/npm/dm/vue-final-modal" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/vue-final-modal"><img src="https://img.shields.io/npm/l/vue-final-modal.svg?sanitize=true" alt="License"></a>
  <a href="https://app.netlify.com/sites/vue-final-modal/deploys"><img src="https://api.netlify.com/api/v1/badges/444b13a8-540f-4438-94da-80c865c8f103/deploy-status" alt="Netlify Status"></a>
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/vue-final-modal"><img src="https://badgen.net/npm/v/vue-final-modal" alt="Version"></a>
  <a href="https://www.npmjs.com/package/vue-final-modal"><img src="https://badgen.net/badgesize/brotli/hunterliu1003/vue-final-modal/master/dist/VueFinalModal.umd.js" alt="Size"></a>
  <a href='https://coveralls.io/github/vue-final/vue-final-modal?branch=master'><img src='https://coveralls.io/repos/github/vue-final/vue-final-modal/badge.svg?branch=master' alt='Coverage Status' /></a>
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/vue-final-modal"><img src="https://badgen.net/npm/v/vue-final-modal/next" alt="Version"></a>
  <a href="https://www.npmjs.com/package/vue-final-modal"><img src="https://badgen.net/badgesize/brotli/hunterliu1003/vue-final-modal/next/dist/VueFinalModal.umd.js" alt="Size"></a>
  <a href='https://coveralls.io/github/vue-final/vue-final-modal?branch=next'><img src='https://coveralls.io/repos/github/vue-final/vue-final-modal/badge.svg?branch=next' alt='Coverage Status' /></a>
</p>

<p align="right">
  <a href="https://www.buymeacoffee.com/PL2qJIx" target="_blank" rel="noopener noreferrer">
    <img width="200" src="https://cdn.buymeacoffee.com/buttons/v2/default-green.png" alt="Buy Me A Coffee" />
  </a>
</p>

Looking for a Vue 3 version? [It's over here](https://github.com/hunterliu1003/vue-final-modal/tree/next)

## 🎉 [Documentation](https://vue-final-modal.org)

## 🙌 [Examples](https://vue-final-modal.org/examples)

## Introduction

### **Vue Final Modal** is a **renderless component**!

You can create a [higher-order component](https://vue-final-modal.org/examples/recommended-use) easily and can customize `template`, `script` and `style` based on your needs.

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

## Installation

**Vue 3.0**

version `1.x`, `3.x` is for Vue 3.x.

NPM:

```bash
npm install vue-final-modal@next --save
```

Yarn:

```bash
yarn add vue-final-modal@next
```

**Vue 2.0**

version `0.x`, `2.x` is for Vue 2.x.

NPM:

```bash
npm install vue-final-modal@latest --save
```

Yarn:

```bash
yarn add vue-final-modal@latest
```

## Registeration

### Vue

```js
import VueFinalModal from 'vue-final-modal'

Vue.use(VueFinalModal())
```

### Nuxt

- **Write a plugin `vue-final-modal.js`**

```js
// plugins/vue-final-modal.js
import VueFinalModal from 'vue-final-modal/lib'

Vue.use(VueFinalModal())
```

- **Add plugin into `nuxt.config.js`**

```js
// nuxt.config.js
export default {
  plugins: [{ src: '~plugins/vue-final-modal.js' }],
  build: {
    transpile: ['vue-final-modal']
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

> `v-model` is necessary when you open a modal with `$vfm.show(name)` API.

```html
<vue-final-modal v-model="showModal" name="example">
  Modal Content Here
</vue-final-modal>
```

```js
this.$vfm.show('example')
```

## **Configuration**

> Only work in v0.18+

Configuration options can be passed as a second argument to `Vue.use`.

```js
import VueFinalModal from 'vue-final-modal'

Vue.use(VueFinalModal(), { ... })
```

- `componentName`
- `key`
- `dynamicContainerName`

## **API**

- In Options API:

Plugin API can be called within any component through `this.$vfm`.

- In Composition API (Vue 3 only):

```js
import { inject } from 'vue'

export default {
  setup() {
    const $vfm = inject('$vfm')
  }
}
```

- `$vfm.show(name, params)`
- `$vfm.hide([names])`
- `$vfm.hideAll()`
- `$vfm.toggle(name, show, params)`
- `$vfm.get([names])`
- `$vfm.dynamicModals`
- `$vfm.openedModals`
- `$vfm.modals`

## **Props**

- `value`
- `name`
- `ssr`
- `classes`
- `overlayClass`
- `contentClass`
- `styles`
- `overlayStyle`
- `contentStyle`
- `lockScroll`
- `hideOverlay`
- `clickToClose`
- `escToClose`
- `preventClick`
- `attach`
- `transition`
- `overlayTransition`
- `zIndexAuto`
- `zIndexBase`
- `zIndex`
- `focusRetain`
- `focusTrap`

## **Events**

- `@click-outside`
- `@before-open`
- `@opened`
- `@before-close`
- `@closed`

## **Slots**

If you open a modal though API `show(name, params)`, You can use scoped-slot to get `params` in template:

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

> `parmas` will be reset to `{}` automatically after `closed` event. You can avoid the modal to reset the `params` to empty object by calling `event.stop()`.

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

> There is no perfect library even the `final` of vue modal.

If you have any ideas for optimization of `vue-final-modal`, feel free to open [issues](https://github.com/hunterliu1003/vue-final-modal/issues) or [pull requests](https://github.com/hunterliu1003/vue-final-modal/pulls).
