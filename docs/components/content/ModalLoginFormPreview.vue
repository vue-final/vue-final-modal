<script setup lang="ts">
import { ModalsContainer, useModal } from 'vue-final-modal'
import ModalLoginForm from './ModalLoginForm.vue'

const { open, close } = useModal({
  component: ModalLoginForm,
  attrs: {
    onSubmit(formData) {
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

  <ModalsContainer />
</template>
