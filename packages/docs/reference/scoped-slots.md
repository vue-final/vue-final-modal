# Scoped slot

## close

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
