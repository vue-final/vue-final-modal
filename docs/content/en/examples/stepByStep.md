---
title: Step by step
description: 'Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.'
position: 2
category: Examples
fullscreen: true
---

<alert>

[Checkout the example source code](https://github.com/hunterliu1003/vue-final-modal/tree/master/example/src/components/basic)

</alert>



## Style the modal component step by step

**1. Hello, `vue-final-modal` !**

<v-basic></v-basic>

<!-- <codepen path="basic/VBasic"></codepen> -->

<show-code>

```vue
<template>
  <div>
    <vue-final-modal v-model="showModal">
      <span class="modal__title">Hello, vue-final-modal !</span>
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

**2. Add `background-color`, `border-radius`**

<v-background></v-background>

<!-- <codepen path="basic/VBackground"></codepen> -->

<show-code>

```vue
<template>
  <div>
    <vue-final-modal v-model="showModal" content-class="modal-content">
      <span class="modal__title">Hello, vue-final-modal !</span>
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

**3. Center the modal with prop `classes`**

<v-centered></v-centered>

<!-- <codepen path="basic/VCentered"></codepen> -->

<show-code>

```vue
<template>
  <div>
    <vue-final-modal
      v-model="showModal"
      classes="modal-container"
      content-class="modal-content"
    >
      <span class="modal__title">Hello, vue-final-modal !</span>
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

**4. Add `content` for the modal**

<v-content></v-content>

<!-- <codepen path="basic/VContent"></codepen> -->

<show-code>

```vue
<template>
  <div>
    <vue-final-modal
      v-model="showModal"
      classes="modal-container"
      content-class="modal-content"
    >
      <span class="modal__title">Hello, vue-final-modal !</span>
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

**5. Add button to close the modal**

<v-close-button></v-close-button>

<!-- <codepen path="basic/VCloseButton"></codepen> -->

<show-code>

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
      <span class="modal__title">Hello, vue-final-modal !</span>
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

**6. Make the modal `scrollable` and limit the `max-height` for mobile**

<v-scrollable></v-scrollable>

<!-- <codepen path="basic/VScrollable"></codepen> -->

<show-code>

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
      <span class="modal__title">Hello, vue-final-modal !</span>
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

**7. Add `confirm` and `cancel` buttons**

<v-action-buttons></v-action-buttons>

<!-- <codepen path="basic/VActionButtons"></codepen> -->

<show-code>

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
      <span class="modal__title">Hello, vue-final-modal !</span>
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

**8. Make the modal stackable**

<v-stackable></v-stackable>

<!-- <codepen path="basic/VStackable"></codepen> -->

<show-code>

```vue
<template>
  <div>
    <vue-final-modal
      v-model="showModal"
      classes="modal-container"
      content-class="modal-content"
    >
      <button class="modal__close" @click="showModal = true">
        <mdi-close></mdi-close>
      </button>
      <span class="modal__title">Hello, vue-final-modal !</span>
      <div class="modal__content">
        <p v-for="i in 100" :key="i">
          Vue Final Modal is a renderless, stackable, detachable and lightweight
          modal component.
        </p>
      </div>
      <div class="modal__action">
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
        <span>Try click →&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <button class="vfm-btn" @click="showConfirmModal = true">
          confirm
        </button>
        <button class="vfm-btn" @click="showModal = false">cancel</button>
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

### Optional steps

**Prop: `hideOverlay`**

<!-- <tailwind-hide-overlay></tailwind-hide-overlay> -->

**Prop: `lockScroll`**

<!-- <tailwind-lock-scroll></tailwind-lock-scroll> -->

**Prop: `clickToClose`**

<!-- <tailwind-click-to-close></tailwind-click-to-close> -->

**Prop: `preventClick`**

<!-- <tailwind-prevent-click></tailwind-prevent-click> -->

**Prop: `attach`**

<tailwind-attach></tailwind-attach>
