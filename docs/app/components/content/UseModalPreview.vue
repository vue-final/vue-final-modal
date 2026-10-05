<script setup lang="ts">
import { useModal } from 'vue-final-modal'
import ModalConfirm from './ModalConfirm.vue'

const { show, hide } = useModal({
  component: ModalConfirm,
  attrs: {
    title: 'Hello World!',
    onConfirm() {
      hide()
    },
  },
  slots: {
    default: '<p>UseModal: The content of the modal</p>',
  },
})
</script>

<template>
  <VButton @click="() => show()">
    Open Modal
  </VButton>
</template>
