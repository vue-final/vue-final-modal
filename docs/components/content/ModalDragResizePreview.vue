<script setup lang="ts">
import { ModalsContainer, useModal } from 'vue-final-modal'

const { open } = useModal({
  keepAlive: true,
  component: defineAsyncComponent(() => import('./ModalDragResize.vue')),
})
</script>

<template>
  <VButton @click="() => open()">
    Open Modal
  </VButton>

  <ModalsContainer />
</template>
