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

Default transition:

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

## `overlayTransition`

- Type: `String`
- Default: `'vfm'`

CSS transition applied to the modal overlay element.

Default transition:

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

## `lockScroll`

- Type: `Boolean`
- Default: `true`

`vue-final-modal` use [body-lock-scroll](https://www.npmjs.com/package/body-scroll-lock) to disabled the scrolling of body while the modal is displayed.

## `hideOverlay`

- Type: `Boolean`
- Default: `false`

Hide the display of the overlay.

## `clickToClose`

- Type: `Boolean`
- Default: `true`

Clicking outside of modal content element will close the modal.

## `preventClick`

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

## `zIndexBase`

- Type: `[String, Number]`
- Default: `1000`

Calculate `z-index` automatically with zIndexBase. If zIndex is set, `zIndexBase` will become invalid.

## `zIndex`

- Type: `[String, Number]`
- Default: `false`

Set specific `z-index` to root of the modal element. If zIndex is set, `zIndexBase` will become invalid.
