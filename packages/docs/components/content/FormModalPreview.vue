<script setup lang="ts">
import { ModalsContainer, useModal } from 'vue-final-modal'
import FormModal from './FormModal.vue'

const { open, close } = useModal<InstanceType<typeof FormModal>['$props']>({
  component: markRaw(FormModal),
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
