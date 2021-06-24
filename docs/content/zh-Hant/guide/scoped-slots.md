---
title: 作用域插槽 (Scoped Slots)
description: 'Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.'
position: 6
category: 導覽
fullscreen: true
version: 2
---

## close

- 型別： `Function`

當你以 HOC 的方式使用 vue-final-modal 時. 你可以以 scoped-slot 關閉(close) modal：

```vue
<template>
  <vue-final-modal v-slot="{ close }" v-bind="$attrs" v-on="$listeners">
    <div>哈囉，Vue Final Modal</div>
    <button @click="close">close modal</button>
  </vue-final-modal>
</template>

<script>
export default {
  name: 'VueFinalModal',
  inheritAttrs: false
}
</script>
```

## params

- 型別： `Any`
- 預設： `{}`

當你透過 [API](/zh-Hant/api) `$vfm.show(name, params)` 開啟 modal，你可以使用 scoped-slot 取得 params：

```html
<template v-slot="{ params }">
  <!-- modal content -->
</template>
```