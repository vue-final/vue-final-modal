<script setup lang="ts">
import { useModal } from 'vue-final-modal'
import ModalConfirmPlainCss from './ModalConfirmPlainCss.vue'

const { open, close } = useModal({
  component: ModalConfirmPlainCss,
  attrs: {
    title: 'Hello World!',
    onConfirm() {
      close()
    },
  },
  slots: {
    default: '<p>The content of the modal</p>',
  },
})
</script>

<template>
  <VButton @click="open">
    Open Modal
  </VButton>
</template>
