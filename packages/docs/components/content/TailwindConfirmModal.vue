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
    class="flex justify-center items-center"
    content-class="flex flex-col p-4 bg-white dark:bg-black rounded-lg space-y-2"
    @update:model-value="val => emit('update:modelValue', val)"
  >
    <h1 class="text-xl">{{ title }}</h1>
    <slot />
    <button class="mt-1 ml-auto px-2 border rounded-lg" @click="emit('confirm')">Confirm</button>
  </VueFinalModal>
</template>
