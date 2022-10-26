<script setup lang="ts">
import { ModalsContainer, useVfm } from 'vue-final-modal'
import ConfirmModal from './ConfirmModal.vue'

const vfm = useVfm()
const { open, close } = vfm.useModal<InstanceType<typeof ConfirmModal>['$props']>({
  component: markRaw(ConfirmModal),
  attrs: {
    title: 'Hello World!',
    onConfirm() {
      alert('confirm')
      close()
    },
  },
  slots: {
    default: '<p>UseModal: The content of the modal</p>',
  },
})
</script>

<template>
  <VButton class="p-2 border rounded" @click="() => open()">
    Open Modal by useModal()
  </VButton>

  <ModalsContainer />
</template>
