<script setup lang="ts">
import { useId } from 'vue'
import { VueFinalModal } from 'vue-final-modal'

defineProps<{
  title?: string
}>()

const titleId = useId()
</script>

<template>
  <VueFinalModal
    v-slot="{ close }"
    content-class="absolute bottom-0 w-full p-4 bg-white dark:bg-gray-900 space-y-2"
    swipe-to-close="down"
    content-transition="vfm-slide-down"
    overlay-transition="vfm-fade"
    :aria-labelledby="titleId"
  >
    <div class="flex items-center justify-between gap-2">
      <h1 :id="titleId" class="text-xl">
        {{ title }}
      </h1>
      <button type="button" class="px-2 border rounded-lg" aria-label="Close" @click="close()">
        ×
      </button>
    </div>
    <div class="text-3xl">
      Swipe down to close the modal
    </div>
    <slot />
  </VueFinalModal>
</template>
