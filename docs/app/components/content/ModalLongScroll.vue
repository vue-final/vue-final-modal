<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'

defineProps<{
  title?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: boolean): void
  (e: 'confirm'): void
}>()
</script>

<template>
  <VueFinalModal
    content-transition="vfm-fade"
    overlay-transition="vfm-fade"
    content-class="absolute inset-0"
    @update:model-value="(val) => emit('update:modelValue', val)"
  >
    <div
      class="absolute inset-0 h-full overflow-auto"
      @click.self="() => emit('update:modelValue', false)"
    >
      <div class="flex flex-col max-w-xl my-12 mx-auto p-4 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg space-y-2">
        <h1 class="text-xl">
          {{ title }}
        </h1>
        <slot />
        <button class="mt-1 ml-auto px-2 border rounded-lg" @click="() => emit('confirm')">
          Confirm
        </button>
      </div>
    </div>
  </VueFinalModal>
</template>
