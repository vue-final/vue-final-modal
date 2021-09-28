<template>
  <vue-final-modal v-bind="$attrs" classes="vfm-container" content-class="vfm-content" focus-trap>
    <h3>{{ title }}</h3>
    <div class="py-4">
      <slot></slot>
    </div>
    <div class="flex justify-end space-x-2">
      <button class="btn-primary" @click="$emit('confirm')">Confirm</button>
      <button class="btn-secondary" @click="$emit('cancel')">Cancel</button>
    </div>
    <button class="btn-close" @click="$emit('update:modelValue', false)">×</button>
  </vue-final-modal>
</template>

<script setup>
import { VueFinalModal } from 'vue-final-modal'

defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
:deep(.vfm-container) {
  @apply flex justify-center items-center;
}
:deep(.vfm-content) {
  @apply relative min-w-80 max-h-2/3 p-4 rounded-lg bg-white;
}
:global(.dark .vfm-content) {
  @apply bg-gray-900;
}

h3 {
  @apply m-0 text-3xl;
}
.btn-primary,
.btn-secondary {
  @apply px-2 py-1 border rounded font-medium;
}
.btn-primary {
  @apply text-light-300 bg-green-500 border-green-500;
}
.btn-close {
  @apply absolute top-2 right-2 p-2 text-xl;
}
</style>
