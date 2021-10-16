# Properties

:::info
You can use [Live Playground](/guide/live-playground) to toggle properties to see the effect of each prop.
:::

## Props

Prop Name | Description | Type | Default
:-- | :-- | :-- | :--
name | Modal name for the [API](/reference/api) `$vfm.show(name)`, `$vfm.hide(name)`, etc. | `String` | `null`
display-directive | The directive to use in conditionally rendering. `if` will use `v-if` and `show` will use `v-show`. | `'if' \| 'show'` | `show`
classes | Custom class names for the modal container. | `[String, Object, Array]` | `''`
content-class | Custom class names for the modal content. | `[String, Object, Array]` | `''`
overlay-class | Custom class names for the modal overlay. | `[String, Object, Array]` | `''`
styles | Style that will be applied to the modal container. | `[Object, Array]` | `{}`
content-style | Style that will be applied to the modal content. | `[Object, Array]` | `{}`
overlay-style | Style that will be applied to the modal overlay. | `[Object, Array]` | `{}`
transition | CSS transition applied to the modal container.<br />(See [example](#transition-example)) | `[String, Object]` | `'vfm'`
overlay-transition | CSS transition applied to the modal overlay.<br />(See [example](#overlay-transition-example)) | `[String, Object]` |  `'vfm'`
lock-scroll | Disables the scrolling of body while the modal is displayed.<br/>Under the hood we use [`body-scroll-lock`](https://github.com/willmcpo/body-scroll-lock) to implement this feature. | `Boolean` |  `true`
hide-overlay | Hiding the display of the overlay. | `Boolean` |  `false`
click-to-close | Enabled closing the modal by clicking overlay of the modal. | `Boolean` |  `true`
esc-to-close | Press `esc` to close the modal. | `Boolean` |  `false`
non-modal | The click event will not be blocked by overlay.<br />Set the root element of `vue-final-modal` style to `pointer-events: none;`. | `Boolean` |  `false`
attach | Specifies which DOM element that this component should detach to.<br />1. Set `false` will disabled this feature.<br />2. String can be any valid `querySelector`, e.g. `'body'`, `'#app'`.<br />3. Object can be any valid `Node`, e.g. `this.$refs.container`. | `Any` |  `false`
z-index-auto | Auto binding `z-index` base on the prop `z-index-base` and adding `2` by each stackable modal. If zIndex is set, `z-index-auto`, `z-index-base` will be ignored. | `Boolean` |  `true`
z-index-base | Calculate `z-index` automatically with z-index-base. If zIndex is set, `z-index-auto`, `z-index-base` will be ignored. | `[String, Number]` |  `1000`
z-index | Set specific `z-index` to root of the modal element. If zIndex is set, `z-index-auto`, `z-index-base` will be ignored. | `[String, Number]` |  `false`
focus-retain | Focus the modal `vfm__container` after the modal enter. | `Boolean` |  `true`
focus-trap | Enables focus trap meaning that only inputs/buttons that are withing the modal window can be focused by pressing Tab (plugin uses very naive implementation of the focus trap). | `Boolean` |  `false`
drag | Enables draggable modal. | `Boolean` |  `false`
fit-parent | Limit the x-axis, y-axis, width and height of the `.vfm__content` to not exceed the `.vfm__container`. | `Boolean` |  `false`
drag-selector | When set, the modal is only draggable with the element that can be selected by `querySelectorAll(dragSelector)`.<br />(See [example](#drag-selector-example)) | `String` |  `''`
keep-changed-style | Keep the style that was changed by `drag` and `resize` after modal closed. | `Boolean` |  `false`
resize | Enables resizable modal. | `Boolean` |  `false`
resize-directions | Active directions for resizable modal.<br />Valid values are: `['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl']` | `Array` |  `[]`
min-width | Limit `min-width` for resizable modal. | `Number` |  `0`
min-height | Limit `min-height` for resizable modal. | `Number` |  `0`
max-width | Limit `max-width` for resizable modal. | `Number` |  `Infinity`
max-height | Limit `max-height` for resizable modal. | `Number` |  `Infinity`

### Transition Example

<!-- <show-code text="Show default transition CSS"> -->

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

<!-- </show-code> -->

<!-- <show-code text="Show example transition Object" class="pt-2"> -->

```vue
<template>
  <vue-final-modal
    :transition="{
      'enter-active-class': 'transition duration-200 ease-in-out transform',
      'enter-from-class': 'translate-y-full',
      'enter-to-class': 'translate-y-0',
      'leave-active-class': 'transition duration-200 ease-in-out transform',
      'leave-to-class': 'translate-y-full',
      'leave-from-class': 'translate-y-0'
    }"
  >
    ...modal content
  </vue-final-modal>
</template>
```

<!-- </show-code> -->

### Overlay Transition Example

<!-- <show-code text="Show default transition CSS"> -->

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

<!-- </show-code> -->

<!-- <show-code text="Show example transition Object" class="pt-2"> -->

```vue
<template>
  <vue-final-modal
    :transition="{
      'enter-active-class': 'transition duration-200 ease-in-out transform',
      'enter-from-class': 'translate-y-full',
      'enter-to-class': 'translate-y-0',
      'leave-active-class': 'transition duration-200 ease-in-out transform',
      'leave-to-class': 'translate-y-full',
      'leave-from-class': 'translate-y-0'
    }"
  >
    ...modal content
  </vue-final-modal>
</template>
```

<!-- </show-code> -->

### Drag Selector Example

```html
<vue-final-modal drag-selector=".modal-drag-handle">
  <div class="modal-title modal-drag-handle">...</div>
  <div class="modal-content">...</div>
  <div class="modal-action">...</div>
</vue-fianl-modal>
```

## Events

Event Name | Description
:-- | :--
@click-outside | Emits while modal container on click.<br />If prop [`clickToClose`](/reference/properties#clicktoclose) is `false`, the event will still be emitted.
@before-open | Emits while modal is still invisible, but before transition starting.
@opened | Emits after modal became visible and transition ended.
@before-close | Emits before modal is going to be closed.
@closed | Emits right before modal is destroyed.
@drag:start | Emits on drag start.
@drag:move | Emits on drag move.
@drag:end | Emits on drag end.
@resize:start | Emits on resize start.
@resize:move | Emits on resize move.
@resize:end | Emits on resize end.

### Events playground

Open this modal below to see an `alert` for all the events:

<CodeBlock :importComponentInstanceFn="() => import('@/components/use-cases/VEvents.vue')" :importComponentRawFn="() => import('@/components/use-cases/VEvents.vue?raw')"></CodeBlock>

## Slot Scope

### close

- type: `Function`

When you are using vue-final-modal as a HOC. you can `close` modal with scoped-slot:

```vue
<template>
  <vue-final-modal v-slot="{ close }" v-bind="$attrs">
    <div>Hello Vue Final Modal</div>
    <button @click="close">close modal</button>
  </vue-final-modal>
</template>

<script>
export default {
  name: 'CustomModal',
  inheritAttrs: false
}
</script>
```

### params

- type: `Any`
- default: `{}`

When you open a modal though the [API](/reference/api) `$vfm.show(name, params)`, you can get `params` with scoped-slot:

```html
<template v-slot="{ params }">
  <!-- modal content -->
</template>
```

## Overview the default value of properties

```vue
<template>
  <vue-final-modal
    :name="null"
    :value="false"
    display-directive="show"
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
    :non-modal="false"
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
