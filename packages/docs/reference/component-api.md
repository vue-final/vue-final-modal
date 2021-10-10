# Properties

:::info
You can use [Live Playground](/guide/live-playground) to toggle properties to see the effect of each prop.
:::

## Props

Prop Name | Description | Type | Default
:-- | :-- | :-- | :--
name | Modal name for the [API](/reference/api) `$vfm.show(name)`, `$vfm.hide(name)`, etc. | `string` | `null`

// TODO: complete table

## Events

// TODO: add table

## Slot Props

// TODO: add table

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
