---
title: Properties
description: 'Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.'
category: Guide
position: 4
version: 2
---

<alert>You can use [Live demo](/examples/liveDemo) to toggle properties to see the effect by yourself.</alert>

## Overview the default value of properties

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

- Type: `String`
- Default: `null`

Modal name for the [API](/api) `$vfm.show(name)`, `$vfm.hide(name)`, etc.

<alert>`v-model` is necessary when you open a modal with `$vfm.show(name)`.</alert>

## `ssr`

- Type: `Boolean`
- Default: `true`

Enabled Server-Side Rendering.

## `classes`

- Type: `[String, Object, Array]`
- Default: `''`

Custom class names for the modal container.

## `content-class`

- Type: `[String, Object, Array]`
- Default: `''`

Custom class names for the modal content.

## `overlay-class`

- Type: `[String, Object, Array]`
- Default: `''`

Custom class names for the modal overlay.

## `styles`

- Type: `[Object, Array]`
- Default: `{}`

Style that will be applied to the modal container.

## `content-style`

- Type: `[Object, Array]`
- Default: `{}`

Style that will be applied to the modal content.

## `overlay-style`

- Type: `[Object, Array]`
- Default: `{}`

Style that will be applied to the modal overlay.

## `transition`

- Type: `[String, Object]`
- Default: `'vfm'`

CSS transition applied to the modal container.

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

- Type: `[String, Object]`
- Default: `'vfm'`

CSS transition applied to the modal overlay.

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

- Type: `Boolean`
- Default: `true`

Disabled the scrolling of body while the modal is displayed.

<alert>Using [`body-scroll-lock`](https://github.com/willmcpo/body-scroll-lock) to implement the feature. </alert>

## `hide-overlay`

- Type: `Boolean`
- Default: `false`

Hiding the display of the overlay.

## `click-to-close`

- Type: `Boolean`
- Default: `true`

Enabled closing the modal by clicking overlay of the modal.

## `esc-to-close`

- Type: `Boolean`
- Default: `false`

Press `esc` to close the modal.

## `prevent-click`

- Type: `Boolean`
- Default: `false`

The click event will not be blocked by overlay.<br />
Set the root element of `vue-final-modal` style to `pointer-events: none;`.

## `attach`

- Type: `Any`
- Default: `false`

Specifies which DOM element that this component should detach to.

1. Set `false` will disabled this feature.
2. String can be any valid `querySelector`, e.g. `'body'`, `'#app'`.
3. Object can be any valid `Node`, e.g. `this.$refs.container`.

## `z-index-auto`

- Type: `Boolean`
- Default: `true`

Auto binding `z-index` base on the prop `z-index-base` and adding `2` by each stackable modal. If zIndex is set, `z-index-auto`, `z-index-base` will be ignored.

## `z-index-base`

- Type: `[String, Number]`
- Default: `1000`

Calculate `z-index` automatically with z-index-base. If zIndex is set, `z-index-auto`, `z-index-base` will be ignored.

## `z-index`

- Type: `[String, Number]`
- Default: `false`

Set specific `z-index` to root of the modal element. If zIndex is set, `z-index-auto`, `z-index-base` will be ignored.

## `focus-retain`

- Type: `Boolean`
- Default: `true`

Focus the modal `vfm__container` after the modal enter.

## `focus-trap`

- Type: `Boolean`
- Default: `false`

Enables focus trap meaning that only inputs/buttons that are withing the modal window can be focused by pressing Tab (plugin uses very naive implementation of the focus trap).

## `drag`

- Type: `Boolean`
- Default: `false`

Enables draggable modal.

## `fit-parent`

- Type: `Boolean`
- Default: `false`

Limit the x-axis, y-axis, width and height of the `.vfm__content` to not exceed the `.vfm__container`.

## `drag-selector`

- Type: `String`
- Default: `''`
- Example:

  ```html
  <vue-final-modal drag-selector=".modal-drag">
    <div class="modal-title modal-drag">...</div>
    <div class="modal-content">...</div>
    <div class="modal-action">...</div>
  </vue-fianl-modal>
  ```

Only the element that was selected by `querySelectorAll(string)` can trigger drag modal.

## `keep-changed-style`

- Type: `Boolean`
- Default: `false`

Keep the style that was changed by `drag` and `resize` after modal closed.

## `resize`

- Type: `Boolean`
- Default: `false`

Enables resizable modal.

## `resize-directions`

- Type: `Array`
- Default: `[]`
- Valid value: `['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl']`

Active directions for resizable modal.

## `min-width`

- Type: `Number`
- Default: `0`

Limit `min-width` for resizable modal.
## `min-height`

- Type: `Number`
- Default: `0`

Limit `min-height` for resizable modal.
## `max-width`

- Type: `Number`
- Default: `Infinity`

Limit `max-width` for resizable modal.
## `max-height`

- Type: `Number`
- Default: `Infinity`

Limit `max-height` for resizable modal.