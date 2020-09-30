# Vue Final Modal

<p align="center"><a href="https://vue-final-modal.org" target="_blank" rel="noopener noreferrer"><img src="https://vue-final-modal.org/preview.png" alt="Vue Final Modal Logo"></a></p>

<p align="center">
  <a href="https://npmcharts.com/compare/vue-final-modal?minimal=true"><img src="https://img.shields.io/npm/dm/vue-final-modal.svg?sanitize=true" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/vue-final-modal"><img src="https://badgen.net/bundlephobia/minzip/vue-final-modal" alt="Size"></a>
  <a href="https://www.npmjs.com/package/vue-final-modal"><img src="https://img.shields.io/npm/v/vue-final-modal.svg?sanitize=true" alt="Version"></a>
  <a href="https://www.npmjs.com/package/vue-final-modal"><img src="https://img.shields.io/npm/l/vue-final-modal.svg?sanitize=true" alt="License"></a>
  <a href="https://app.netlify.com/sites/vue-final-modal/deploys"><img src="https://api.netlify.com/api/v1/badges/444b13a8-540f-4438-94da-80c865c8f103/deploy-status" alt="Netlify Status"></a>
</p>

<p align="right">
  <a href="https://www.buymeacoffee.com/PL2qJIx" target="_blank" rel="noopener noreferrer">
    <img width="200" src="https://cdn.buymeacoffee.com/buttons/v2/default-green.png" alt="Buy Me A Coffee" />
  </a>
</p>

### 🎉 [Documentation](https://vue-final-modal.org)

### 🙌 [Examples](https://vue-final-modal.org/examples)

## Introduction

`Vue Final Modal` is a renderless component<br />
You can create a wrapper component easily and can customize `template`, `script` and `style` based on your needs.

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

## Install

**Vue 3.0**

NPM:

```bash
npm install vue-final-modal@next --save
```

Yarn:

```bash
yarn add vue-final-modal@next
```

**Vue 2.x**

NPM:

```bash
npm install vue-final-modal --save
```

Yarn:

```bash
yarn add vue-final-modal
```

## Basic usage

**1. Import and register the modal component.**

```js
import { VueFinalModal } from 'vue-final-modal'

export default {
  components: {
    VueFinalModal
  }
}
```

**2. Add the modal component to the template.**

```html
<vue-final-modal v-model="showModal">
  Modal Content Here
</vue-final-modal>
```

**3. Create a button to toggle the modal.**

```html
<button @click="showModal = true">Launch</button>
```

**4. All default props**

```js
const CLASS_TYPES = [String, Object, Array]

{
  value: { type: Boolean, default: false },
  ssr: { type: Boolean, default: true },
  classes: { type: CLASS_TYPES, default: '' },
  overlayClass: { type: CLASS_TYPES, default: '' },
  contentClass: { type: CLASS_TYPES, default: '' },
  lockScroll: { type: Boolean, default: true },
  hideOverlay: { type: Boolean, default: false },
  clickToClose: { type: Boolean, default: true },
  preventClick: { type: Boolean, default: false },
  attach: { type: null, default: false, validator: validateAttachTarget },
  transition: { type: String, default: 'vfm' },
  overlayTransition: { type: String, default: 'vfm' },
  zIndexBase: { type: [String, Number], default: 1000 },
  zIndex: { type: [Boolean, String, Number], default: false }
}
```

**5. Events.**

- @before-open: Before open
- @opened: When opened
- @before-close: Before close
- @closed: After closed

## Contribution

If you have any ideas for optimization of `vue-final-modal`, feel free to open [issues](https://github.com/hunterliu1003/vue-final-modal/issues) or [pull requests](https://github.com/hunterliu1003/vue-final-modal/pulls).
