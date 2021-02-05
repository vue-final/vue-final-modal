---
title: Setup
description: 'Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.'
position: 1
category: Getting started
---

## Installation

**@next: <badge>1.x.x</badge>, <badge>3.x.x</badge> for Vue 3**

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

**@latest: <badge>0.x.x</badge>, <badge>2.x.x</badge> for Vue 2**

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
