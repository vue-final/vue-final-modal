---
title: Properties
description: 'Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.'
position: 2
category: Getting Start
---

## `ssr`

- Type: `Boolean`
- Default: `true`

Use `v-if` (false) or `v-show` (true) to display the modal.

## `classes`

- Type: `[String, Object, Array]`
- Default: `''`

Custom class names for the modal container element.

## `contentClass`

- Type: `[String, Object, Array]`
- Default: `''`

Custom class names for the modal content element.

## `overlayClass`

- Type: `String`
- Default: `''`

Custom class names for the modal overlay element.

## `transition`

- Type: `String`
- Default: `'vfm'`

CSS transition applied to the modal container element.

## `overlayTransition`

- Type: `String`
- Default: `'vfm'`

CSS transition applied to the modal overlay element.


## `lockScroll`

- Type: `Boolean`
- Default: `true`

Disabled scroll of body while the modal is displayed.

## `hideOverlay`

- Type: `Boolean`
- Default: `false`

Hides the display of the overlay.

## `clickToClose`

- Type: `Boolean`
- Default: `true`

Clicking outside of modal content element will close the modal.

## `preventClick`

- Type: `Boolean`
- Default: `false`

The click event will not be blocked by overlay.

## `attach`

- Type: `Any`
- Default: `body`

Specifies which DOM element that this component should detach to.

1. By default, the modal will be attached to the `<body>` element.
2. Set `false` will disabled this feature. 
3. String can be any valid `querySelector`
4. Object can be any valid `Node`. 

## `zIndex`

- Type: `[String, Number]`
- Default: `1000`

Set `z-index` to both of the modal container and overlay elements.

## Example

<base-example></base-example>

```html[SFC]
<template>
  <div>
    <vue-final-modal
      v-model="showModal"
      classes="flex justify-center items-center"
      content-class="max-h-1/2 p-4 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded overflow-auto"
      overlay-class="overlay"
      transition="vfm"
      overlay-transition="vfm"
      :lock-scroll="true"
      :hide-overlay="false"
      :click-to-close="true"
      :prevent-click="false"
      attach="body"
      :z-index="1000"
    >
      <span class="text-2xl mb-2">Hello, world!</span>
    </vue-final-modal>
    <base-button @click="showModal = true">Hello, world!</base-button>
  </div>
</template>

<script>
export default {
  data: () => ({
    showModal: false
  })
}
</script>

<style lang="scss" scoped>
::v-deep .overlay {
  opacity: 0.5;
}
</style>
```