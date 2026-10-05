<script setup lang="ts">
import { useModal } from 'vue-final-modal'
import ModalLoginForm from './ModalLoginForm.vue'

const { open, close } = useModal({
  component: ModalLoginForm,
  attrs: {
    onSubmit(formData) {
      // eslint-disable-next-line no-alert
      alert(JSON.stringify(formData, null, 2))
      close()
    },
  },
})
</script>

<template>
  <VButton @click="open">
    Open Modal
  </VButton>
</template>
