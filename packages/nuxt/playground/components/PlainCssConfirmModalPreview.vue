<script setup lang="ts">
import { ModalsContainer, useModal } from 'vue-final-modal'
import PlainCssConfirmModal from './PlainCssConfirmModal.vue'

const { open, close } = useModal({
  component: markRaw(PlainCssConfirmModal),
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
  <button @click="() => open()">
    Open Modal
  </button>

  <ModalsContainer />
</template>
