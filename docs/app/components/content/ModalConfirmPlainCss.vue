<script setup lang="ts">
import { useId } from 'vue'
import { VueFinalModal } from 'vue-final-modal'

defineProps<{
  title?: string
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
}>()

const titleId = useId()
</script>

<template>
  <VueFinalModal
    v-slot="{ close }"
    class="confirm-modal"
    content-class="confirm-modal-content"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
    :aria-labelledby="titleId"
  >
    <h1 :id="titleId">
      {{ title }}
    </h1>
    <slot />
    <div class="confirm-modal-actions">
      <button type="button" @click="close()">
        Cancel
      </button>
      <button type="button" @click="emit('confirm')">
        Confirm
      </button>
    </div>
  </VueFinalModal>
</template>

<style>
.confirm-modal {
  display: flex;
  justify-content: center;
  align-items: center;
}
.confirm-modal-content {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background: #fff;
  border-radius: 0.5rem;
}
.confirm-modal-content > * + *{
  margin: 0.5rem 0;
}
.confirm-modal-content h1 {
  font-size: 1.375rem;
}
.confirm-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin: 0.25rem 0 0;
}
.confirm-modal-content button {
  padding: 0 8px;
  border: 1px solid;
  border-radius: 0.5rem;
}
.dark .confirm-modal-content {
  background: #000;
}
</style>
