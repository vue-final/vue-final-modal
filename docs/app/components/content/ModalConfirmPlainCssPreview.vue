<script setup lang="ts">
import { useModal } from 'vue-final-modal'
import ModalConfirmPlainCss from './ModalConfirmPlainCss.vue'

const { show, hide } = useModal({
  component: ModalConfirmPlainCss,
  attrs: {
    title: 'Hello World!',
    onConfirm() {
      hide()
    },
  },
  slots: {
    default: '<p>The content of the modal</p>',
  },
})
</script>

<template>
  <VButton @click="show">
    Open Modal
  </VButton>
</template>
