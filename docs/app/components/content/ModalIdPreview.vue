<script setup lang="ts">
import { useVfm } from 'vue-final-modal'
import ModalConfirm from './ModalConfirm.vue'

const vfm = useVfm()
const modalId = Symbol('modalId')

function confirm() {
  vfm.close(modalId)
}
</script>

<template>
  <VButton @click="() => vfm.open(modalId)">
    Open Modal
  </VButton>

  <ModalConfirm
    :modal-id="modalId"
    title="Hello World!"
    @confirm="() => confirm()"
  >
    <p>The content of the modal</p>
  </ModalConfirm>
</template>
