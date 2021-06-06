---
title: Scoped Slots
description: 'Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.'
position: 6
category: Guide
fullscreen: true
version: 2
---

## close

- type: `Function`

When you are using vue-final-modal as a HOC. you can `close` modal with scoped-slot:

```vue
<template>
  <vue-final-modal v-slot="{ close }" v-bind="$attrs" v-on="$listeners">
    <div>Hello Vue Final Modal</div>
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

- type: `Any`
- default: `{}`

When you open a modal though the [API](/api) `$vfm.show(name, params)`, you can get `params` with scoped-slot:

```html
<template v-slot="{ params }">
  <!-- modal content -->
</template>
```