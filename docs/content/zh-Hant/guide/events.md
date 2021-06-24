---
title: 事件（Events）
description: 'Vue Final Modal 是一個無渲染、可堆疊、可拆卸且輕巧的 modal 元件。'
category: 導覽
position: 5
fullscreen: true
version: 2
---

**範例**:

<v-events class="mb-4"></v-events>

<sfc-view>

```vue
<template>
  <div>
    <vue-final-modal
      v-model="showModal"
      @click-outside="clickOutside"
      @before-open="beforeOpen"
      @opened="opened"
      @before-close="beforeClose"
      @closed="closed"
      @cancel="showModal = false"
    >
      <template v-slot:title>Events Example!</template>
    </vue-final-modal>
    <v-button highlight @click="showModal = true">Open modal</v-button>
  </div>
</template>
```

```vue
<script>
export default {
  data: () => ({
    showModal: false
  }),
  methods: {
    clickOutside() {
      alert('click-outside')
    },
    beforeOpen() {
      alert('beforeOpen')
    },
    opened() {
      alert('opened')
    },
    beforeClose() {
      alert('beforeClose')
    },
    closed() {
      alert('closed')
    }
  }
}
</script>
```

</sfc-view>

## `@click-outside`

當點擊 modal 的容器（container）時發送事件。

<alert>就算 [`clickToClose`](/zh-Hant/guide/properties#clicktoclose) 設定為 `false`，這個事件依然會被發送。</alert>

## `@before-open`

當 modal 開始轉場進入到可見狀態前發送事件。

<alert>可以透過調用 `event.stop()` 可以停止打開 modal。</alert>

## `@opened`

當 modal 結束轉場進入到可見狀態後發送事件。

## `@before-close`

當 modal 即將被關閉時發送事件。

<alert>可以透過調用 `event.stop()` 來停止關閉 modal。</alert>

## `@closed`

當 modal 被關閉後發送事件。

<alert>在關閉 modal 之後，你可以透過調用 `event.stop()` 來防止清除 [`params`](/zh-Hant/guide/params)。</alert>

## `@drag:start`

當拖曳開始時發送事件。

## `@drag:move`

拖曳時發送事件。

## `@drag:end`

當拖曳結束時發送事件。

## `@resize:start`

當調整大小開始時發送事件。

## `@resize:move`

調整大小時發送事件。

## `@resize:end`

當調整大小結束時發送事件。
