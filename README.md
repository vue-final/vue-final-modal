# Vue Final Modal

<p align="center"><a href="https://hunterliu1003.github.io/vue-final-modal/" target="_blank" rel="noopener noreferrer"><img width="600" src="https://hunterliu1003.github.io/assets/gifs/vue-final-modal.gif" alt="Vue Final Modal Logo"></a></p>

<p align="center">
  <a href="https://npmcharts.com/compare/vue-final-modal?minimal=true"><img src="https://img.shields.io/npm/dm/vue-final-modal.svg?sanitize=true" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/vue-final-modal"><img src="https://badgen.net/bundlephobia/minzip/vue-final-modal" alt="Size"></a>
  <a href="https://www.npmjs.com/package/vue-final-modal"><img src="https://img.shields.io/npm/v/vue-final-modal.svg?sanitize=true" alt="Version"></a>
  <a href="https://www.npmjs.com/package/vue-final-modal"><img src="https://img.shields.io/npm/l/vue-final-modal.svg?sanitize=true" alt="License"></a>
</p>

### [Documentation](https://hunterliu1003.github.io/vue-final-modal/)
### [Examples](https://hunterliu1003.github.io/vue-final-modal/examples)
### [CDN example](https://codepen.io/hunterliu1003/pen/PoZmbPm?editors=1010)

## Introduction

features:
  - Tailwind CSS friendly
  - Renderless component
  - SSR support
  - Stackable
  - Detachable
  - Scrollable
  - Transition support
  - Mobile friendly
  - 3.2kb gzipped


## Install

NPM:
```bash
npm install vue-final-modal --save
```

Yarn: 

```bash
yarn add vue-final-modal
```

## How to use

```html
<button @click="showModal = true">Show modal</button>

<vue-final-modal v-model="showModal">
  <button @click="showModal = false">close modal</button>
</vue-final-modal>
```

```js
import { VueFinalModal } from 'vue-final-modal'

export default {
  components: {
    VueFinalModal,
  },
  data: () => ({
    showModal: false
  })
}
```

## Roadmap

If you have any ideas for optimization of `vue-final-modal`, feel free to open [issues](https://github.com/hunterliu1003/vue-final-modal/issues) or [pull request](https://github.com/hunterliu1003/vue-final-modal/pulls).

These are the features that will be added in the comming weeks:

- draggable modal
- resizable modal
- dynamic emit modal component with vue directive like:
  - `this.$modal.show('hello-world')`
  - `this.$modal.hide('hello-world')`
- support Vue 3.0