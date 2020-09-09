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

### Basic usage

#### 1. Register in SFC:

```js[vue]


import { VueFinalModal } from 'vue-final-modal/lib'

export default {
  components: {
    VueFinalModal
  }
}
```

#### 2. Install globally:

```js[main.js]


import { VueFinalModal } from 'vue-final-modal/lib'

Vue.component('VueFinalModal', VueFinalModal)
```

### Nuxt

#### 1. Write a plugin `vue-final-modal.js`:

```js[vue-final-modal.js]


import { VueFinalModal } from 'vue-final-modal/lib'

Vue.component('VueFinalModal', VueFinalModal)
```

#### 2. Add plugin into `nuxt.config.js`:

```js[nuxt.config.js]


export default {
  plugins: [
    '~plugins/vue-final-modal.js'
  ],
}
```



### CDN

#### 1. jsDelivr:

```html
<script src="https://cdn.jsdelivr.net/npm/vue-final-modal"></script>
```

#### 2. Unpkg:

```html
<script src="https://unpkg.com/vue-final-modal"></script>
```
