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

<v-basic class="mb-4"></v-basic>

<codepen path="basic/VBasic"></codepen>

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

<v-background class="mb-4"></v-background>

<!-- <codepen path="basic/VBackground"></codepen> -->

**3. Center the modal with prop `classes`**

<v-centered class="mb-4"></v-centered>

<!-- <codepen path="basic/VCentered"></codepen> -->

**4. Add `content` for the modal**

<v-content class="mb-4"></v-content>

<!-- <codepen path="basic/VContent"></codepen> -->

**5. Add button to close the modal**

<v-close-button class="mb-4"></v-close-button>

<!-- <codepen path="basic/VCloseButton"></codepen> -->

**6. Make the modal `scrollable` and limit the `max-height` for mobile**

<v-scrollable class="mb-4"></v-scrollable>

<!-- <codepen path="basic/VScrollable"></codepen> -->

**7. Add `confirm` and `cancel` buttons**

<v-action-buttons class="mb-4"></v-action-buttons>

<!-- <codepen path="basic/VActionButtons"></codepen> -->

**8. Make the modal stackable**

<v-stackable class="mb-4"></v-stackable>

<!-- <codepen path="basic/VStackable"></codepen> -->

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

<!-- <tailwind-attach></tailwind-attach> -->
