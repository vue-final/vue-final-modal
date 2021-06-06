---
title: Setup
description: 'Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.'
position: 1
category: Getting started
version: 2
---

## Installation

### **Vue 3**

<code-group>
  <code-block label="npm" active>

```bash
npm install vue-final-modal@next
```

  </code-block>
  <code-block label="yarn">

```bash
yarn add vue-final-modal@next
```

  </code-block>
  <code-block label="pnpm">

```bash
pnpm add vue-final-modal@next
```

  </code-block>
</code-group>

### **Vue 2**

<code-group>
  <code-block label="npm" active>

```bash
npm install vue-final-modal@latest
```

  </code-block>
  <code-block label="yarn">

```bash
yarn add vue-final-modal@latest
```

  </code-block>
  <code-block label="pnpm">

```bash
yarn add vue-final-modal@latest
```

  </code-block>
</code-group>

## Import base on your needs

Checkout:
- [$vfm](/api) for using $vfm API.
- [VueFinalModal](/examples/recommend) for using basic modal component.
- [ModalsContainer](/dynamic-modal) for using dynamic modal.

```vue
<script>
import { $vfm, VueFinalModal, ModalsContainer } from 'vue-final-modal'

export default {
  components: {
    VueFinalModal,
    ModalsContainer
  }
}
</script>
```

## Global Register plugin

### Import plugin `vfmPlugin`

- Type: `Function | PluginObject`
- Arguments: `Object`
  - default;
  ```js
  {
    key: '$vfm',
    componentName: 'VueFinalModal',
    dynamicContainerName: 'ModalsContainer'
  }
  ```
- Returns: `PluginObject`
- Examples:

```js
import { vfmPlugin } from 'vue-final-modal'
// or
import vfmPlugin from 'vue-final-modal'
```

### Register plugin in Vue 2

```js[main.js]
import { vfmPlugin } from 'vue-final-modal'

Vue.use(vfmPlugin)
```

### Register plugin in Nuxt

- **Write a plugin `vue-final-modal.js`**

```js[plugins/vue-final-modal.js]
import { vfmPlugin } from 'vue-final-modal/lib'

Vue.use(vfmPlugin)
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

### Overwrite `key`, `componentName`, `dynamicContainerName`

```js[main.js]
import { vfmPlugin } from 'vue-final-modal'

Vue.use(vfmPlugin({
  key: '$vfm',
  componentName: 'VueFinalModal',
  dynamicContainerName: 'ModalsContainer'
}))
```

## CDN

<alert>[Live demo](https://codepen.io/hunterliu1003/pen/ZEWoYeE)</alert>

- **jsDelivr**

```html
<script src="https://cdn.jsdelivr.net/npm/vue-final-modal"></script>
```

- **Unpkg**

```html
<script src="https://unpkg.com/vue-final-modal"></script>
```
