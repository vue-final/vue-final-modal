<script setup lang="ts">
import { ModalsContainer, useModal } from 'vue-final-modal'
import ConfirmModal from './ConfirmModal.vue'

const { open, close } = useModal<
  InstanceType<typeof ConfirmModal>['$props']
>({
  component: markRaw(ConfirmModal),
  attrs: {
    title: 'Hello World!',
    onConfirm() {
      // eslint-disable-next-line no-alert
      alert('confirm')
      close()
    },
  },
  slots: {
    default: '<p>UseModal: The content of the modal</p>',
  },
})
open()
</script>

<template>
  <VButton class="p-2 border rounded" @click="() => open()">
    Open Modal by useModal()
  </VButton>

  <ModalsContainer />
</template>
