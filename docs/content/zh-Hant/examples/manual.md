---
title: Manual usage
description: 'Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.'
category: Examples
position: 9
---

## Basic usage

### **Set `v-model` to `true` on click**

```html
<vue-final-modal v-model="showModal">
  Modal Content Here
</vue-final-modal>

<button @click="showModal = true">Launch</button>
```

### **Open modal with [API](/api)**

<alert>`v-model` is necessary when you open a modal with `$vfm.show(name)` API.</alert>

```html
<vue-final-modal v-model="showModal" name="example">
  Modal Content Here
</vue-final-modal>
```

```js
this.$vfm.show('example')
```

## Example

<alert>

Try to toggle checkbox below, then click `Open Modal` button.

</alert>

<basic-options></basic-options>

## Step by step

<alert>

[Checkout examples source code](https://github.com/hunterliu1003/vue-final-modal/tree/master/example/src/components/basic)

</alert>

### **Hello, `vue-final-modal`**

<v-basic></v-basic>

<show-code class="pt-4">

```vue
<template>
  <div>
    <vue-final-modal v-model="showModal">
      <span class="modal__title">Hello, vue-final-modal</span>
    </vue-final-modal>
    <button class="vfm-btn" @click="showModal = true">Open modal</button>
  </div>
</template>

<script>
export default {
  data: () => ({
    showModal: false
  })
}
</script>

<style scoped>
.modal__title {
  font-size: 1.5rem;
  font-weight: 700;
}
</style>
```

</show-code>

### **Add `background-color`, `border-radius`**

<v-background></v-background>

<show-code class="pt-4">

```vue
<template>
  <div>
    <vue-final-modal v-model="showModal" content-class="modal-content">
      <span class="modal__title">Hello, vue-final-modal</span>
    </vue-final-modal>
    <button class="vfm-btn" @click="showModal = true">Open modal</button>
  </div>
</template>

<script>
export default {
  data: () => ({
    showModal: false
  })
}
</script>

<style scoped>
::v-deep .modal-content {
  display: inline-block;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  background: #fff;
}
.modal__title {
  font-size: 1.5rem;
  font-weight: 700;
}
</style>

<style scoped>
.dark-mode div::v-deep .modal-content {
  border-color: #2d3748;
  background-color: #1a202c;
}
</style>
```

</show-code>

### **Centered modal**

<v-centered></v-centered>

<show-code class="pt-4">

```vue
<template>
  <div>
    <vue-final-modal
      v-model="showModal"
      classes="modal-container"
      content-class="modal-content"
    >
      <span class="modal__title">Hello, vue-final-modal</span>
    </vue-final-modal>
    <button class="vfm-btn" @click="showModal = true">Open modal</button>
  </div>
</template>

<script>
export default {
  data: () => ({
    showModal: false
  })
}
</script>

<style scoped>
::v-deep .modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep .modal-content {
  display: flex;
  flex-direction: column;
  margin: 0 1rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  background: #fff;
}
.modal__title {
  font-size: 1.5rem;
  font-weight: 700;
}
</style>

<style scoped>
.dark-mode div::v-deep .modal-content {
  border-color: #2d3748;
  background-color: #1a202c;
}
</style>
```

</show-code>

### **Add `content`**

<v-content></v-content>

<show-code class="pt-4">

```vue
<template>
  <div>
    <vue-final-modal
      v-model="showModal"
      classes="modal-container"
      content-class="modal-content"
    >
      <span class="modal__title">Hello, vue-final-modal</span>
      <div class="modal__content">
        <p>
          Vue Final Modal is a renderless, stackable, detachable and lightweight
          modal component.
        </p>
      </div>
    </vue-final-modal>
    <button class="vfm-btn" @click="showModal = true">Open modal</button>
  </div>
</template>

<script>
export default {
  data: () => ({
    showModal: false
  })
}
</script>

<style scoped>
::v-deep .modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep .modal-content {
  display: flex;
  flex-direction: column;
  margin: 0 1rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  background: #fff;
}
.modal__title {
  font-size: 1.5rem;
  font-weight: 700;
}
</style>

<style scoped>
.dark-mode div::v-deep .modal-content {
  border-color: #2d3748;
  background-color: #1a202c;
}
</style>
```

</show-code>

### **Add close button**

<v-close-button></v-close-button>

<show-code class="pt-4">

```vue
<template>
  <div>
    <vue-final-modal
      v-model="showModal"
      classes="modal-container"
      content-class="modal-content"
    >
      <button class="modal__close" @click="showModal = false">
        <mdi-close></mdi-close>
      </button>
      <span class="modal__title">Hello, vue-final-modal</span>
      <div class="modal__content">
        <p>
          Vue Final Modal is a renderless, stackable, detachable and lightweight
          modal component.
        </p>
      </div>
    </vue-final-modal>
    <button class="vfm-btn" @click="showModal = true">Open modal</button>
  </div>
</template>

<script>
export default {
  data: () => ({
    showModal: false
  })
}
</script>

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

</show-code>

### **`Scrollable`**

<v-scrollable></v-scrollable>

<show-code class="pt-4">

```vue
<template>
  <div>
    <vue-final-modal
      v-model="showModal"
      classes="modal-container"
      content-class="modal-content"
    >
      <button class="modal__close" @click="showModal = false">
        <mdi-close></mdi-close>
      </button>
      <span class="modal__title">Hello, vue-final-modal</span>
      <div class="modal__content">
        <p v-for="i in 100" :key="i">
          Vue Final Modal is a renderless, stackable, detachable and lightweight
          modal component.
        </p>
      </div>
    </vue-final-modal>
    <button class="vfm-btn" @click="showModal = true">Open modal</button>
  </div>
</template>

<script>
export default {
  data: () => ({
    showModal: false
  })
}
</script>

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

</show-code>

### **Add `confirm` and `cancel` buttons**

<v-action-buttons></v-action-buttons>

<show-code class="pt-4">

```vue
<template>
  <div>
    <vue-final-modal
      v-model="showModal"
      classes="modal-container"
      content-class="modal-content"
    >
      <button class="modal__close" @click="showModal = false">
        <mdi-close></mdi-close>
      </button>
      <span class="modal__title">Hello, vue-final-modal</span>
      <div class="modal__content">
        <p v-for="i in 100" :key="i">
          Vue Final Modal is a renderless, stackable, detachable and lightweight
          modal component.
        </p>
      </div>
      <div class="modal__action">
        <button class="vfm-btn" @click="showModal = false">confirm</button>
        <button class="vfm-btn" @click="showModal = false">cancel</button>
      </div>
    </vue-final-modal>
    <button class="vfm-btn" @click="showModal = true">Open modal</button>
  </div>
</template>

<script>
export default {
  data: () => ({
    showModal: false
  })
}
</script>

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

</show-code>

### **Stackable**

<v-stackable></v-stackable>

<show-code class="pt-4">

```vue
<template>
  <div>
    <!-- First modal -->
    <vue-final-modal
      v-model="showModal"
      classes="modal-container"
      content-class="modal-content"
    >
      <button class="modal__close" @click="showModal = false">
        <mdi-close></mdi-close>
      </button>
      <span class="modal__title">Hello, vue-final-modal</span>
      <div class="modal__content">
        <p v-for="i in 5" :key="i">
          Vue Final Modal is a renderless, stackable, detachable and lightweight
          modal component.
        </p>
      </div>
      <div class="modal__action">
        <span>Try click →&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <button class="vfm-btn" @click="showConfirmModal = true">
          confirm
        </button>
        <button class="vfm-btn" @click="showModal = false">cancel</button>
      </div>
    </vue-final-modal>

    <!-- Second modal -->
    <vue-final-modal
      v-model="showConfirmModal"
      classes="modal-container"
      content-class="modal-content"
    >
      <button class="modal__close" @click="showConfirmModal = false">
        <mdi-close></mdi-close>
      </button>
      <span class="modal__title">Confirm</span>
      <div class="modal__content">
        Confirm to submit.
      </div>
      <div class="modal__action">
        <button class="vfm-btn" @click="confirm">
          confirm
        </button>
        <button class="vfm-btn" @click="showConfirmModal = false">
          cancel
        </button>
      </div>
    </vue-final-modal>

    <button class="vfm-btn" @click="showModal = true">Open modal</button>
  </div>
</template>

<script>
export default {
  data: () => ({
    showModal: false,
    showConfirmModal: false
  }),
  methods: {
    confirm() {
      this.showConfirmModal = false
      this.showModal = false
    }
  }
}
</script>

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
  margin: 0 2rem 0.5rem 0;
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

</show-code>

### **Accessibility**


<v-accessibility></v-accessibility>

<show-code open class="mt-2">

```html
<template>
    <vue-final-modal
      ...
      focus-trap
    >
      ...modal content
    </vue-final-modal>
</template>
```

</show-code>
