<script setup lang="ts">
import { ModalsContainer, useModal } from 'vue-final-modal'
import ModalBottom from './ModalBottom.vue'
const { open, close } = useModal({
  component: ModalBottom,
  attrs: {
    title: 'Hello World!',
    onClose() {
      close()
    },
  },
  slots: {
    default: '<p>ModalBottom: The content of the modal</p>',
  },
})
</script>

<template>
  <VButton @click="() => open()">
    Open Modal
  </VButton>

  <ModalsContainer />
</template>
