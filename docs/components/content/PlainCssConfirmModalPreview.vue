<script setup lang="ts">
import { ModalsContainer, useModal } from 'vue-final-modal'
import PlainCssConfirmModal from './PlainCssConfirmModal.vue'

const { open, close } = useModal({
  component: PlainCssConfirmModal,
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

  <ModalsContainer />
</template>
