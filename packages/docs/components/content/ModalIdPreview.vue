<script setup lang="ts">
import { useVfm } from 'vue-final-modal'

const vfm = useVfm()
const modalId = Symbol('modalId')

function confirm() {
  alert('confirm')
  vfm.close(modalId)
}
</script>

<template>
  <VButton class="p-2 border rounded" @click="() => vfm.open(modalId)">
    Open Modal by modalId
  </VButton>

  <ConfirmModal
    :modal-id="modalId"
    title="Hello World!"
    @confirm="() => confirm()"
  >
    <p>The content of the modal</p>
  </ConfirmModal>
</template>
