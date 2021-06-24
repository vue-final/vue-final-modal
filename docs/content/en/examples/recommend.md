---
title: Recommended usage
description: 'Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.'
category: Examples
position: 11
version: 2
---

## Write a `HOC`

<alert>

You can create a `higher-order component` easily and can customize `template`, `script` and `style` based on your needs.

</alert>

### CustomModal.vue

<sfc-view>

```vue
<template>
  <vue-final-modal
    v-slot="{ params, close }"
    v-bind="$attrs"
    classes="modal-container"
    content-class="modal-content"
    v-on="$listeners"
  >
    <span class="modal__title">
      <slot name="title"></slot>
    </span>
    <div class="modal__content">
      <slot v-bind:params="params"></slot>
    </div>
    <div class="modal__action">
      <v-button @click="$emit('confirm', close)">confirm</v-button>
      <v-button @click="$emit('cancel', close)">cancel</v-button>
    </div>
    <button class="modal__close" @click="close">
      <mdi-close></mdi-close>
    </button>
  </vue-final-modal>
</template>
```
```vue
<script>
export default {
  name: 'CustomModal',
  inheritAttrs: false
}
</script>
```
```vue
<style scoped>
::v-deep .modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep .modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  max-height: 90%;
  margin: 0 1rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  background: #fff;
}
.modal__title {
  margin: 0 2rem 0 0;
  font-size: 1.5rem;
  font-weight: 700;
}
.modal__content {
  flex-grow: 1;
  overflow-y: auto;
}
.modal__action {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  padding: 1rem 0 0;
}
.modal__close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
</style>

<style scoped>
.dark-mode div::v-deep .modal-content {
  border-color: #2d3748;
  background-color: #1a202c;
}
</style>

```

</sfc-view>

## How to use CustomModal

### Example

<hoc-example class="mb-4"></hoc-example>

<sfc-view>

```vue
<template>
  <div>
    <custom-modal v-model="show" @confirm="confirm" @cancel="cancel">
      <template v-slot:title>Hello, vue-final-modal</template>
      <p>Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.</p>
    </custom-modal>

    <v-button @click="show = true">Open modal</v-button>
  </div>
</template>
```
```vue
<script>
export default {
  data: () => ({
    show: false
  }),
  methods: {
    confirm() {
      // some code...
      this.show = false
    },
    cancel(close) {
      // some code...
      close()
    }
  }
}
</script>
```

</sfc-view>