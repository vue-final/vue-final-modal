<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { useModal } from 'vue-final-modal'

const { open, destroy } = useModal({
  keepAlive: true,
  component: defineAsyncComponent(() => import('./ModalDragResize.vue')),
})

onBeforeUnmount(() => destroy())
</script>

<template>
  <VButton @click="() => open()">
    Open Modal
  </VButton>
</template>
