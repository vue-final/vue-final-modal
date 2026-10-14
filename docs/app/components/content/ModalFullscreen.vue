<script setup lang="ts">
import { useId } from 'vue'
import { VueFinalModal } from 'vue-final-modal'

defineProps<{
  title?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const titleId = useId()
</script>

<template>
  <VueFinalModal
    content-class="w-full h-full flex flex-col p-4 bg-white dark:bg-gray-900 space-y-2"
    :hide-overlay="true"
    content-transition="vfm-fade"
    :aria-labelledby="titleId"
  >
    <h1 :id="titleId" class="text-xl">
      {{ title }}
    </h1>
    <slot />
    <button type="button" class="absolute top-4 right-4 px-2 border rounded-lg" aria-label="Close" @click="emit('close')">
      ×
    </button>
  </VueFinalModal>
</template>
