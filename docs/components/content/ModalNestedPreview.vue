<script setup lang="ts">
import { ModalsContainer, useModal } from 'vue-final-modal'
import ModalConfirm from './ModalConfirm.vue'

const modalSecond = useModal({
  component: ModalConfirm,
  attrs: {
    title: 'The second confirm modal',
    onConfirm() {
      modalSecond.close()
    },
  },
})

const modalFirst = useModal({
  component: ModalConfirm,
  attrs: {
    title: 'The first confirm modal',
    onConfirm() {
      modalSecond.open()
    },
  },
  slots: {
    default: 'Magna deserunt nulla aliquip velit aute. Et occaecat elit nulla excepteur labore cupidatat. Duis culpa mollit commodo dolor qui Lorem qui laborum elit elit Lorem occaecat. Commodo eiusmod esse voluptate officia amet quis occaecat aliqua. Proident do irure amet ut occaecat dolor laboris consectetur.',
  },
})
</script>

<template>
  <VButton @click="() => modalFirst.open()">
    Open Modal
  </VButton>

  <ModalsContainer />
</template>
