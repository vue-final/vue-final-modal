<script setup lang="ts">
import { ModalsContainer, useModal } from 'vue-final-modal'
import ModalFullscreen from './ModalFullscreen.vue'
const { open, close } = useModal({
  component: ModalFullscreen,
  attrs: {
    title: 'Hello World!',
    onClose() {
      close()
    },
  },
  slots: {
    default: '<p>ModalFullscreen: The content of the modal</p>',
  },
})
</script>

<template>
  <VButton @click="() => open()">
    Open Modal
  </VButton>

  <ModalsContainer />
</template>
