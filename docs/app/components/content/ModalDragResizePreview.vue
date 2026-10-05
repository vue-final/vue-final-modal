<script setup lang="ts">
import { useModal } from 'vue-final-modal'

const { open } = useModal({
  component: defineAsyncComponent(() => import('./ModalDragResize.vue')),
})
</script>

<template>
  <VButton @click="() => open()">
    Open Modal
  </VButton>
</template>
