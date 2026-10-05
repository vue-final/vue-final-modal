<script setup lang="ts">
import { useModal } from 'vue-final-modal'
import ModalLoginForm from './ModalLoginForm.vue'

const { show, hide } = useModal({
  component: ModalLoginForm,
  attrs: {
    onSubmit(formData) {
      // eslint-disable-next-line no-alert
      alert(JSON.stringify(formData, null, 2))
      hide()
    },
  },
})
</script>

<template>
  <VButton @click="show">
    Open Modal
  </VButton>
</template>
