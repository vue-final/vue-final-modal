---
title: 參數（Params）
description: 'Vue Final Modal 是一個無渲染、可堆疊、可拆卸且輕巧的 modal 元件。'
position: 6
category: 導覽
fullscreen: true
version: 2
---

當你透過 [API](/zh-Hant/api) `$vfm.show(name, params)` 開啟 modal。

## 你有兩個方法取得 `params`：

### 用 `scoped-slot`

```html
<template v-slot="{ params }">
  <!-- modal content -->
</template>
```

### 在 `@beforeOpen` 事件

```html
<vue-final-modal @beforeOpen="event => event.ref.params">
  <!-- modal content -->
</vue-final-modal>
```

<alert>在 [`closed`](/zh-Hant/guide/events#closed) 事件之後 `params` 會自動被重置為 `{}`。你可以透過調用 `event.stop()` 來避免 `params` 被重置</alert>
