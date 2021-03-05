---
title: 安裝設定
description: 'Vue Final Modal 是一個無渲染、可堆疊、可拆卸且輕巧的 modal 元件。'
position: 1
category: 快速入門
---

## 安裝

**Vue 3 使用 <badge>1.x.x</badge>、<badge>3.x.x</badge>**

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

**Vue 2 使用 <badge>0.x.x</badge>、<badge>2.x.x</badge>**

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

## 註冊

### Vue

```js[main.js]
import VueFinalModal from 'vue-final-modal'

Vue.use(VueFinalModal())
```

### Nuxt

- 新增一個 plugin **`vue-final-modal.js`**

```js[plugins/vue-final-modal.js]
import VueFinalModal from 'vue-final-modal/lib'

Vue.use(VueFinalModal())
```

- **在 `nuxt.config.js` 的 plugin 與 build 中加入**

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
