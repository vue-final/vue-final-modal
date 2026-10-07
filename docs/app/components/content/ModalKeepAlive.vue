<script setup lang="ts">
import { ref } from 'vue'
import { VueFinalModal } from 'vue-final-modal'

defineProps<{
  title?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const draft = ref('')
</script>

<template>
  <VueFinalModal
    class="flex justify-center items-center"
    content-class="flex flex-col w-full max-w-md mx-4 p-4 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg space-y-2"
    content-transition="vfm-fade"
    overlay-transition="vfm-fade"
  >
    <h1 class="text-xl">
      {{ title }}
    </h1>
    <textarea
      v-model="draft"
      class="w-full h-24 p-2 border dark:border-gray-700 rounded-lg bg-transparent"
      placeholder="Type a draft, close the modal, then open it again"
    />
    <button class="mt-1 ml-auto px-2 border rounded-lg" @click="emit('close')">
      Close
    </button>
  </VueFinalModal>
</template>
