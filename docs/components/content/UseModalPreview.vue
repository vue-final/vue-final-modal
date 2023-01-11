<script setup lang="ts">
import { ModalsContainer, useModal } from 'vue-final-modal'
import ConfirmModal from './ConfirmModal.vue'

const { open, close } = useModal<
  InstanceType<typeof ConfirmModal>['$props']
>({
  component: ConfirmModal,
  attrs: {
    title: 'Hello World!',
    onConfirm() {
      close()
    },
  },
  slots: {
    default: '<p>UseModal: The content of the modal</p>',
  },
})
</script>

<template>
  <VButton @click="() => open()">
    Open Modal by useModal()
  </VButton>

  <ModalsContainer />
</template>
