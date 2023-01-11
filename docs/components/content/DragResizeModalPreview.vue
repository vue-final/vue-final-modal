<script setup lang="ts">
import { ModalsContainer, useModal } from 'vue-final-modal'
import DragResizeModal from './DragResizeModal.vue'

const { open } = useModal({
  component: DragResizeModal,
})
</script>

<template>
  <VButton @click="open">
    Open Modal
  </VButton>

  <ModalsContainer />
</template>
