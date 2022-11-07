<script setup lang="ts">
import { ModalsContainer, useModal } from 'vue-final-modal'
import LoginFormModal from './LoginFormModal.vue'

const { open, close } = useModal<InstanceType<typeof LoginFormModal>['$props']>({
  component: markRaw(LoginFormModal),
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
