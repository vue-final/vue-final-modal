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
    class="flex justify-center items-center"
    content-class="flex flex-col max-w-xl mx-4 p-4 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg space-y-2"
    content-transition="vfm-fade"
    overlay-transition="vfm-fade"
    :aria-labelledby="titleId"
  >
    <h1 :id="titleId" class="text-xl">
      {{ title }}
    </h1>
    <slot />
    <div class="flex justify-end gap-2">
      <button type="button" class="px-2 border rounded-lg" @click="close()">
        Cancel
      </button>
      <button type="button" class="px-2 border rounded-lg" @click="emit('confirm')">
        Confirm
      </button>
    </div>
  </VueFinalModal>
</template>
