---
title: Properties
description: 'Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.'
category: Guide
position: 4
---

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

## `contentClass`

- Type: `[String, Object, Array]`
- Default: `''`

Custom class names for the modal content.

## `overlayClass`

- Type: `[String, Object, Array]`
- Default: `''`

Custom class names for the modal overlay.

## `styles`

- Type: `[String, Object, Array]`
- Default: `''`

Style that will be applied to the modal container.

## `contentStyle`

- Type: `[String, Object, Array]`
- Default: `''`

Style that will be applied to the modal content.

## `overlayStyle`

- Type: `[String, Object, Array]`
- Default: `''`

Style that will be applied to the modal overlay.

## `transition`

- Type: `String`
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

## `overlayTransition`

- Type: `String`
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

## `lockScroll`

- Type: `Boolean`
- Default: `true`

Disabled the scrolling of body while the modal is displayed.

<alert>Using [`body-scroll-lock`](https://github.com/willmcpo/body-scroll-lock) to implement the feature. </alert>

## `hideOverlay`

- Type: `Boolean`
- Default: `false`

Hiding the display of the overlay.

## `clickToClose`

- Type: `Boolean`
- Default: `true`

Enabled closing the modal by clicking overlay of the modal.

## `escToClose`

- Type: `Boolean`
- Default: `false`

Press `esc` to close the modal.

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

## `zIndexAuto`

- Type: `Boolean`
- Default: `true`

Auto binding `z-index` base on the prop `zIndexBase` and adding `2` by each stackable modal. If zIndex is set, `zIndexAuto`, `zIndexBase` will be ignored.

## `zIndexBase`

- Type: `[String, Number]`
- Default: `1000`

Calculate `z-index` automatically with zIndexBase. If zIndex is set, `zIndexAuto`, `zIndexBase` will be ignored.

## `zIndex`

- Type: `[String, Number]`
- Default: `false`

Set specific `z-index` to root of the modal element. If zIndex is set, `zIndexAuto`, `zIndexBase` will be ignored.

## `focusRetain`

- Type: `Boolean`
- Default: `true`

Focus the modal `vfm__container` after the modal enter.

## `focusTrap`

- Type: `Boolean`
- Default: `false`

Enables focus trap meaning that only inputs/buttons that are withing the modal window can be focused by pressing Tab (plugin uses very naive implementation of the focus trap).
