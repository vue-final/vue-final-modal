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
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/vue-final-modal"><img src="https://badgen.net/npm/v/vue-final-modal/next" alt="Version"></a>
  <a href="https://www.npmjs.com/package/vue-final-modal"><img src="https://badgen.net/badgesize/brotli/hunterliu1003/vue-final-modal/next/dist/VueFinalModal.umd.js" alt="Size"></a>
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

NPM:

```bash
npm install vue-final-modal@next --save
```

Yarn:

```bash
yarn add vue-final-modal@next
```

**Vue 2.0**

NPM:

```bash
npm install vue-final-modal --save
```

Yarn:

```bash
yarn add vue-final-modal
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
  plugins: [
    { src: '~plugins/vue-final-modal.js' }
  ],
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

### `componentName`

- Type: `String`
- default: `'VueFinalModal'`

Changes component name from "VueFinalModal" to any other string value. It is useful when there is already a global "modal" component.

### `key`

- Type: `String`
- default: `'$vfm'`

Changes API name from "$vfm" to any other string value. It is useful when you use `vue-final-modal` as spinner, toast, notify, etc.


## **API**

- In Options API:

Plugin API can be called within any component through `this.$vfm`.

- In Composition API (Only in Vue 3 version): 

> Only support in Vue 3

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
  - params: `?: object` - Any data that you would want to pass into the modal (@before-open event handler will contain `params` in the event). You can also using scoped-slot to get `params` in template:

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

> `v-model` is necessary when you open a modal with `$vfm.show(name)` API.

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

### `$vfm.toggle(name, show, params)`

- Type: `Function`
- Arguments:
  - name: `String` - Name of the modal
  - show: `?: Boolean` - Show modal or not
  - params: `?: object` - Any data that you would want to pass into the modal (@before-open event handler will contain params in the event). You can also using scoped-slot to get `params` in template:

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

toggle modal by name.

### `$vfm.get(name)`

- Type: `Function`
- Arguments:
  - name: `String` - Name of the modal

return the modal comopnent instance.

### `$vfm.openedModals`

- Type: `Array`

A stack array store the opened modal's vue component instance.

You can use:
1. `$vfm.openedModals[0]` to get the first opened modal instance.
2. `$vfm.openedModals.length` to get how many modals is opened.

### `$vfm.modals`

- Type: `Array`

All modal instances include show and hide.

## **Props**

```js
{
  value: { type: Boolean, default: false },
  name: { type: String, default: null },
  ssr: { type: Boolean, default: true },
  classes: { type: [String, Object, Array], default: '' },
  overlayClass: { type: [String, Object, Array], default: '' },
  contentClass: { type: [String, Object, Array], default: '' },
  styles: { type: [String, Object, Array], default: '' },
  overlayStyle: { type: [String, Object, Array], default: '' },
  contentStyle: { type: [String, Object, Array], default: '' },
  lockScroll: { type: Boolean, default: true },
  hideOverlay: { type: Boolean, default: false },
  clickToClose: { type: Boolean, default: true },
  escToClose: { type: Boolean, default: false },
  preventClick: { type: Boolean, default: false },
  attach: { type: null, default: false, validator: validateAttachTarget },
  transition: { type: String, default: 'vfm' },
  overlayTransition: { type: String, default: 'vfm' },
  zIndexAuto: { type: Boolean, default: true },
  zIndexBase: { type: [String, Number], default: 1000 },
  zIndex: { type: [Boolean, String, Number], default: false },
  focusRetain: { type: Boolean, default: true },
  focusTrap: { type: Boolean, default: false }
}
```

## **Events**

### `@click-outside`

- Emits while modal container on click.

> If prop `clickToClose` is `false`, the event will still be emitted.

### `@before-open`

- Emits while modal is still invisible, but before transition starting. Further opening of the modal can be blocked from this event listener by calling `event.stop()`.

### `@opened`

- Emits after modal became visible and transition ended.

### `@before-close`

- Emits before modal is going to be closed. Further closing of the modal can be blocked from this event listener by calling `event.stop()`.

### `@closed`

- Emits right before modal is destroyed. Further after the modal was closed, you can avoid the modal to reset the `params` to empty object by calling `event.stop()`.

## **Slots**

If you open a modal though API `show(name, params)`, You can using scoped-slot to get `params` in template:

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
