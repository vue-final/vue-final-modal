<script setup lang="ts">
import { useModal } from 'vue-final-modal'
import MyModal from './MyModal.vue'

const { open } = useModal({
  component: MyModal,
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
