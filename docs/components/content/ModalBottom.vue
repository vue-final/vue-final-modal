<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'

defineProps<{
  title?: string
}>()
</script>

<template>
  <VueFinalModal
    content-class="absolute bottom-0 w-full p-4 bg-white dark:bg-gray-900 space-y-2"
    swipe-to-close="down"
    content-transition="vfm-slide-down"
    overlay-transition="vfm-fade"
  >
    <h1 class="text-xl">
      {{ title }}
    </h1>
    <div class="text-3xl">
      Swipe down to close the modal
    </div>
    <slot />
  </VueFinalModal>
</template>
