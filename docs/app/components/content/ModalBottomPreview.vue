<script setup lang="ts">
import { useModal } from 'vue-final-modal'
import ModalBottom from './ModalBottom.vue'
const { show, hide } = useModal({
  component: ModalBottom,
  attrs: {
    title: 'Hello World!',
    onClose() {
      hide()
    },
  },
  slots: {
    default: '<p>ModalBottom: The content of the modal</p>',
  },
})
</script>

<template>
  <VButton @click="() => show()">
    Open Modal
  </VButton>
</template>
