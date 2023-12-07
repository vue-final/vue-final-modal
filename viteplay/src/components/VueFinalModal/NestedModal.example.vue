<script setup lang="ts">
import { ModalsContainer, useModal } from 'vue-final-modal'
import { ref } from 'vue'
import ConfirmModal from './ConfirmModal.vue'

const count = ref(0)

function openConfirmModal() {
  const n = count.value % 4
  const overlayBehavior = n < 2 ? 'auto' : 'persist'
  count.value += 1
  const { close } = useModal({
    defaultModelValue: true,
    component: ConfirmModal,
    attrs: {
      title: 'Confirm?',
      message: 'Are you sure you want to do this?',
      overlayBehavior,
      onConfirm: () => {
        openConfirmModal()
      },
      onCancel: () => close(),
      onClosed: () => count.value -= 1,
    },
  })
}
</script>

<template>
  <div style="display: flex; justify-content: center; align-items: center; width: 100vw; height: 100vh;">
    <button @click="() => openConfirmModal()">
      open nested confirm modal
    </button>
  </div>

  <ModalsContainer />
</template>
