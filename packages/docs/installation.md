# Installation

Install `vue-final-modal` with your favorite package manager:

```bash
pnpm add vue-final-modal@next
# or with yarn
yarn add vue-final-modal@next
# or with npm
npm install vue-final-modal@next
```

:::tip
`vue-final-modal@next` install Vue Final Modal v3 for Vue 3. If your app is using Vue 2, you need to install Vue Final Modal v2: `vue-final-modal@latest`.
:::

## Usage

Here we show the simplest way to use Vue Final Modal:

```vue
<template>
  <button @click="showModal = true">
    show modal
  </button>

  <VueFinalModal v-model="showModal">
    Modal Content!
  </VueFinalModal>
</template>

<script>
import { VueFinalModal } from 'vue-final-modal'

export default {
  components: {
    VueFinalModal,
  },
  setup() {
    const showModal = ref(false)
    
    return { showModal }
  },
}
</script>
```

There are many more features and use cases for Vue Final Modal. Be sure to browse through all the docs!
