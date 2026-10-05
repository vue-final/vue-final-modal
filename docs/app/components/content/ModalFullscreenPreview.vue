<script setup lang="ts">
import { useModal } from 'vue-final-modal'
import ModalFullscreen from './ModalFullscreen.vue'
const { show, hide } = useModal({
  component: ModalFullscreen,
  attrs: {
    title: 'Hello World!',
    onClose() {
      hide()
    },
  },
  slots: {
    default: '<p>ModalFullscreen: The content of the modal</p>',
  },
})
</script>

<template>
  <VButton @click="() => show()">
    Open Modal
  </VButton>
</template>
