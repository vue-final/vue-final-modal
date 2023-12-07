<script lang="ts" setup>
import {
  VueFinalModal,
} from 'vue-final-modal'

defineProps<{
  title: string
  message?: string
  overlayBehavior: 'auto' | 'persist'
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'closed'): void
}>()
</script>

<template>
  <VueFinalModal
    content-transition="vfm-slide-down"
    overlay-transition="vfm-slide-down"
    :overlay-behavior="overlayBehavior"
    style="display: flex; justify-content: center; align-items: center;"
    overlay-style="background-color: rgba(0, 0, 0, 0.4)"
    @closed="() => emit('closed')"
  >
    <template #default="{ close }">
      <div class="confirm-modal">
        <h1>{{ title }}</h1>
        <p v-if="message">
          {{ message }}
        </p>
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
          <button @click="() => emit('confirm')">
            Confirm
          </button>
          <button @click="() => close()">
            Cancel
          </button>
        </div>
      </div>
    </template>
  </VueFinalModal>
</template>

<style scoped>
.confirm-modal {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 20px;
  background-color: #fff;
  border-radius: 5px;
}
.confirm-modal > * {
  margin: 0
}
</style>
