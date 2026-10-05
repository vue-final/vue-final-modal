<script setup lang="ts">
import { useModal } from 'vue-final-modal'

const { show } = useModal({
  component: defineAsyncComponent(() => import('./ModalDragResize.vue')),
})
</script>

<template>
  <VButton @click="() => show()">
    Open Modal
  </VButton>
</template>
