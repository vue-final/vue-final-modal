<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'

defineProps<{
  title?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <VueFinalModal
    content-class="w-full h-full flex flex-col bg-white dark:bg-gray-900 space-y-2"
    :hide-overlay="true"
    content-transition="vfm-fade"
  >
    <h1 class="text-xl">
      {{ title }}
    </h1>
    <slot />
    <button class="absolute top-4 right-4 px-2 border rounded-lg" @click="emit('close')">
      x
    </button>
  </VueFinalModal>
</template>
