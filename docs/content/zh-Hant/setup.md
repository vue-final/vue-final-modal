---
title: 安裝設定
description: 'Vue Final Modal 是一個無渲染、可堆疊、可拆卸且輕巧的 modal 元件。'
position: 1
category: 快速入門
version: 3
---

## 安裝

### **Vue 3**

<code-group>
  <code-block label="npm" active>

```bash
npm install vue-final-modal@3
```

  </code-block>
  <code-block label="yarn">

```bash
yarn add vue-final-modal@3
```

  </code-block>
  <code-block label="pnpm">

```bash
pnpm add vue-final-modal@3
```

  </code-block>
</code-group>

## 按需求引入

查看更多
- [$vfm](/api) API 的使用。
- [VueFinalModal](/examples/recommend) 基礎 modal 的使用。
- [ModalsContainer](/dynamic-modal) 動態 modal 的使用。

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

## 全域註冊套件

### 引入套件 `vfmPlugin`

- 型別：`Function | PluginObject`
- 參數：`Object`
  - 預設：
  ```js
  {
    key: '$vfm',
    componentName: 'VueFinalModal',
    dynamicContainerName: 'ModalsContainer'
  }
  ```
- 回傳：`PluginObject`
- 範例：

```js
import { vfmPlugin } from 'vue-final-modal'
// 或
import vfmPlugin from 'vue-final-modal'
```

### 在 Vue 3 中註冊套件

```js[main.js]
import { vfmPlugin } from 'vue-final-modal'

App.use(vfmPlugin)
```

## CDN

<alert>[Live demo](https://codepen.io/hunterliu1003/pen/OJmNxmB)</alert>

- **jsDelivr**

```html
<script src="https://cdn.jsdelivr.net/npm/vue-final-modal@3"></script>
```

- **Unpkg**

```html
<script src="https://unpkg.com/vue-final-modal@3"></script>
```
