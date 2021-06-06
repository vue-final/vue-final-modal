---
title: 屬性（Properties）
description: 'Vue Final Modal 是一個無渲染、可堆疊、可拆卸且輕巧的 modal 元件。'
category: 導覽
position: 4
version: 2
---

<alert>可使用 [Live demo](/examples/liveDemo) 動態切換屬性來觀看效果。</alert>

## 屬性的默認值

```vue
<template>
  <vue-final-modal
    :name="null"
    :value="false"
    :ssr="true"
    :classes="false"
    overlay-class=""
    content-class=""
    styles=""
    overlay-style=""
    content-style=""
    :lock-scroll="true"
    :hide-overlay="false"
    :click-to-close="true"
    :esc-to-close="false"
    :prevent-click="false"
    :attach="false"
    transition="vfm"
    overlay-transition="vfm"
    :z-index-auto="true"
    :z-index-base="1000"
    :z-index="false"
    :focus-retain="true"
    :focus-trap="false"
    :fit-parent="true"
    :drag="false"
    drag-selector=""
    :keep-changed-style="false"
    :resize="false"
    :resize-directions="['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl']"
    :min-width="0"
    :min-height="0"
    :max-width="Infinity"
    :max-height="Infinity"
  >
    ...modal content
  </vue-final-modal>
</template>
```

## `name`

- 型別： `String`
- 預設： `null`

這個 modal 的名字，用於使用 [API](/zh-Hant/api)  `$vfm.show(name)`、`$vfm.hide(name)` 等。

<alert>如果要使用 `$vfm.show(name)` 打開 modal，`v-model` 是必須給的。</alert>

## `ssr`

- 型別： `Boolean`
- 預設： `true`

啟用伺服器渲染（Server-Side Rendering）。

## `classes`

- 型別： `[String, Object, Array]`
- 預設： `''`

針對 modal 的容器（container）自訂 class。

## `content-class`

- 型別： `[String, Object, Array]`
- 預設： `''`

針對 modal 的內容（content）自訂 class。

## `overlay-class`

- 型別： `[String, Object, Array]`
- 預設： `''`

針對 modal 的外層（overlay）自訂 class。

## `styles`

- 型別： `[Object, Array]`
- 預設： `{}`

針對 modal 的容器（container）自訂樣式。

## `content-style`

- 型別： `[Object, Array]`
- 預設： `{}`

針對 modal 的內容（content）自訂樣式。

## `overlay-style`

- 型別： `[Object, Array]`
- 預設： `{}`

針對 modal 的外層（overlay）自訂樣式。

## `transition`

- 型別： `[String, Object]`
- 預設： `'vfm'`

設定 modal 的容器（container）轉場 CSS。

<show-code text="Show default transition CSS">

```css
.vfm-enter-active,
.vfm-leave-active {
  transition: opacity 0.2s;
}
.vfm-enter,
.vfm-leave-to {
  opacity: 0;
}
```

</show-code>

<show-code text="Show example transition Object" class="pt-2">

```vue
<template>
  <vue-final-modal
    :transition="{
      'enter-active-class': 'transition duration-200 ease-in-out transform',
      'enter-class': 'translate-y-full',
      'enter-to-class': 'translate-y-0',
      'leave-active-class': 'transition duration-200 ease-in-out transform',
      'leave-to-class': 'translate-y-full',
      'leave-class': 'translate-y-0'
    }"
  >
    ...modal content
  </vue-final-modal>
</template>
```

</show-code>

## `overlay-transition`

- 型別： `[String, Object]`
- 預設： `'vfm'`

設定 modal 的外層（overlay）轉場 CSS。

<show-code text="Show default transition CSS">

```css
.vfm-enter-active,
.vfm-leave-active {
  transition: opacity 0.2s;
}
.vfm-enter,
.vfm-leave-to {
  opacity: 0;
}
```

</show-code>

<show-code text="Show example transition Object" class="pt-2">

```vue
<template>
  <vue-final-modal
    :transition="{
      'enter-active-class': 'transition duration-200 ease-in-out transform',
      'enter-class': 'translate-y-full',
      'enter-to-class': 'translate-y-0',
      'leave-active-class': 'transition duration-200 ease-in-out transform',
      'leave-to-class': 'translate-y-full',
      'leave-class': 'translate-y-0'
    }"
  >
    ...modal content
  </vue-final-modal>
</template>
```

</show-code>

## `lock-scroll`

- 型別： `Boolean`
- 預設： `true`

當 modal 起打開時，禁用 body 上的捲軸。

<alert>使用了 [`body-scroll-lock`](https://github.com/willmcpo/body-scroll-lock) 來實作這個功能。 </alert>

## `hide-overlay`

- 型別： `Boolean`
- 預設： `false`

隱藏 modal 的外層（overlay）。

## `click-to-close`

- 型別： `Boolean`
- 預設： `true`

當點擊 modal 的外層（overlay）時，是否關閉 modal。

## `esc-to-close`

- 型別： `Boolean`
- 預設： `false`

是否能透過按下 `esc` 鍵關閉 modal。

## `prevent-click`

- 型別： `Boolean`
- 預設： `false`


外層（overlay）的點擊事件不會被禁用。<br />
設定 `vue-final-modal` 的根元素的樣式是否添加 `pointer-events: none;`。

## `attach`

- 型別： `Any`
- 預設： `false`

使該元件放進指定 DOM 中。

1. 設定為 `false` 則不會啟用這項功能。
2. 如果設定的是字串，必須是 `querySelector` 合法參數的任何字串，例如：`'body'`、`'#app'`。
3. 如果設定的是物件，必須是有效的 `Node` 物件，例如：`this.$refs.container`。

## `z-index-auto`

- 型別： `Boolean`
- 預設： `true`

根據 `z-index-base` 的值自動綁定到 `z-index` 上，並且每當往上堆疊一個 modal 就會加 `2`。如果 `z-index` 有被設定，`z-index-auto` 與 `z-index-base` 則會被忽略。


## `z-index-base`

- 型別： `[String, Number]`
- 預設： `1000`

根據 `z-index-base` 的值自動計算 `z-index`。如果 `z-index` 有被設定，`z-index-auto` 與 `z-index-base` 則會被忽略。

## `z-index`

- 型別： `[String, Number]`
- 預設： `false`

針對該 modal 指定特定的 `z-index`。如果 `z-index` 有被設定，`z-index-auto` 與 `z-index-base` 則會被忽略。

## `focus-retain`

- 型別： `Boolean`
- 預設： `true`

在 modal 進到畫面後，將焦點放到 `vfm__container` 上。

## `focus-trap`

- 型別： `Boolean`
- 預設： `false`

啟動焦點限制（focus trap）則表示只有在 modal 中的輸入框（input）與按鈕（buttons）可以裡用 Tab 鍵去切換焦點（用了非常簡單的焦點限制工具實現）。

## `drag`

- 型別： `Boolean`
- 預設： `false`

啟動可拖曳的 modal。

## `fit-parent`

- 型別： `Boolean`
- 預設： `false`

拖曳不超過 `.vfm__container` 的範圍。

## `drag-selector`

- 型別： `String`
- 預設： `''`
- 範例：

  ```html
  <vue-final-modal drag-selector=".modal-drag">
    <div class="modal-title modal-drag">...</div>
    <div class="modal-content">...</div>
    <div class="modal-action">...</div>
  </vue-fianl-modal>
  ```

只有透過 `querySelectorAll(string)` 選出的元素可點擊拖曳 modal.

## `keep-changed-style`

- 型別： `Boolean`
- 預設： `false`

modal 關閉後保留 `drag` 和 `resize` 更改的樣式。

## `resize`

- 型別： `Boolean`
- 預設： `false`

啟動可調整大小的 modal。

## `resize-directions`

- 型別： `Array`
- 預設： `[]`
- 合法值: `['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl']`

設置可調整 modal 大小的方向。

## `min-width`

- 型別： `Number`
- 預設： `0`

限制 resizable modal 的 `min-width`。
## `min-height`

- 型別： `Number`
- 預設： `0`

限制 resizable modal 的 `min-height`。
## `max-width`

- 型別： `Number`
- 預設： `Infinity`

限制 resizable modal 的 `max-width`。
## `max-height`

- 型別： `Number`
- 預設： `Infinity`

限制 resizable modal 的 `max-height`。