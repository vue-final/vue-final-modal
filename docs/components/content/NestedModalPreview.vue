<script setup lang="ts">
import { ModalsContainer, useModal } from 'vue-final-modal'
import ConfirmModal from './ConfirmModal.vue'

const confirm1 = useModal({
  component: ConfirmModal,
  attrs: {
    title: 'The first confirm modal',
    onConfirm() {
      openConfirm2()
    },
  },
  slots: {
    default: 'Magna deserunt nulla aliquip velit aute. Et occaecat elit nulla excepteur labore cupidatat. Duis culpa mollit commodo dolor qui Lorem qui laborum elit elit Lorem occaecat. Commodo eiusmod esse voluptate officia amet quis occaecat aliqua. Proident do irure amet ut occaecat dolor laboris consectetur.',
  },
})

const confirm2 = useModal({
  component: ConfirmModal,
  attrs: {
    title: 'The second confirm modal',
    onConfirm() {
      confirm2.close()
    },
  },
})

function openConfirm2() {
  confirm2.open()
}
</script>

<template>
  <VButton @click="() => confirm1.open()">
    Open Modal
  </VButton>

  <ModalsContainer />
</template>
