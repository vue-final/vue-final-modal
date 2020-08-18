---
title: Setup
description: 'Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.'
position: 1
category: Getting Start
---

## Installation

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

## Client

- Register in SFC:

```js[vue]


import { VueFinalModal } from 'vue-final-modal'

export default {
  components: {
    VueFinalModal
  }
}
```

- Install globally:

```js[main.js]


import { VueFinalModal } from 'vue-final-modal'

Vue.component('VueFinalModal', VueFinalModal)
```

## Server Side Render

```js[nuxt.config.js]


export default {
  plugins: [
    '~plugins/vue-final-modal.js'
  ],
}
```

```js[vue-final-modal.js]


import VueFinalModal from 'vue-final-modal/lib/VueFinalModal.vue'

Vue.component('VueFinalModal', VueFinalModal)
```

## CDN

- https://www.jsdelivr.com/package/npm/vue-final-modal

```html
<script src="https://cdn.jsdelivr.net/npm/vue-final-modal"></script>
```

- https://unpkg.com/vue-final-modal

```html
<script src="https://unpkg.com/vue-final-modal"></script>
```

## How to use

<iframe height="265" style="width: 100%;" scrolling="no" title="Vue Final Modal" src="https://codepen.io/hunterliu1003/embed/PoZmbPm?height=265&theme-id=dark&default-tab=html,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/hunterliu1003/pen/PoZmbPm'>Vue Final Modal</a> by Hunter