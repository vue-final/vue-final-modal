---
title: Introduction
description: 'Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.'
position: 0
category: Getting Start
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
---

<img src="/preview.png" class="light-img" alt="Vue Final Modal Logo" />
<img src="/preview-dark.png" class="dark-img" alt="Vue Final Modal Logo" />


<p class="flex space-x-4">
  <a href="https://npmcharts.com/compare/vue-final-modal?minimal=true"><img class="m-0" src="https://img.shields.io/npm/dm/vue-final-modal.svg?sanitize=true" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/vue-final-modal"><img class="m-0" src="https://badgen.net/bundlephobia/minzip/vue-final-modal" alt="Size"></a>
  <a href="https://www.npmjs.com/package/vue-final-modal"><img class="m-0" src="https://img.shields.io/npm/v/vue-final-modal.svg?sanitize=true" alt="Version"></a>
  <a href="https://www.npmjs.com/package/vue-final-modal"><img class="m-0" src="https://img.shields.io/npm/l/vue-final-modal.svg?sanitize=true" alt="License"></a>
  <a href="https://app.netlify.com/sites/vue-final-modal/deploys"><img src="https://api.netlify.com/api/v1/badges/444b13a8-540f-4438-94da-80c865c8f103/deploy-status" alt="Netlify Status"></a>
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

## Basic usage

**1. Register component**

```js
import { VueFinalModal } from 'vue-final-modal'

export default {
  components: {
    VueFinalModal
  }
}
```

**2. Add component to template**

```html
<vue-final-modal v-model="showModal">
  Modal Content Here
</vue-final-modal>
```

**3. Create a button**

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

**5. All events**

- @before-open: Before open
- @opened: When opened
- @before-close: Before close
- @closed: After closed

## Basic example

<basic-options></basic-options>

<alert>[Checkout recommended use](/examples/recommended-use)</alert>

## Contribution

If you have any ideas for optimization of `vue-final-modal`, feel free to open [issues](https://github.com/hunterliu1003/vue-final-modal/issues) or [pull request](https://github.com/hunterliu1003/vue-final-modal/pulls).
