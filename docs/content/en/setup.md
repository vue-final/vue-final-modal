---
title: Setup
description: 'Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.'
position: 1
category: Getting Start
---

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

**Register in SFC**

```js[vue]
import { VueFinalModal } from 'vue-final-modal/lib'

export default {
  components: {
    VueFinalModal
  }
}
```

**Install globally**

```js[main.js]
import { VueFinalModal } from 'vue-final-modal/lib'

Vue.component('VueFinalModal', VueFinalModal)
```

## Nuxt

**Write a plugin `vue-final-modal.js`**

```js[vue-final-modal.js]
import VueFinalModal from 'vue-final-modal/lib/VueFinalModal.vue'

Vue.component('VueFinalModal', VueFinalModal)
```

**Add plugin into `nuxt.config.js`**

```js[nuxt.config.js]
export default {
  plugins: [
    '~plugins/vue-final-modal.js'
  ],
}
```



## CDN

**jsDelivr**

```html
<script src="https://cdn.jsdelivr.net/npm/vue-final-modal"></script>
```

**Unpkg**

```html
<script src="https://unpkg.com/vue-final-modal"></script>
```
