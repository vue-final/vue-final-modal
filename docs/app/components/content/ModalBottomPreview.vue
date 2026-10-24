<script setup lang="ts">
import { useModal } from 'vue-final-modal'
import ModalBottom from './ModalBottom.vue'

const { open } = useModal({
  component: ModalBottom,
  attrs: {
    title: 'Hello World!',
  },
  slots: {
    default: '<p>The content of the modal</p>',
  },
})
</script>

<template>
  <VButton @click="() => open()">
    Open Modal
  </VButton>
</template>
