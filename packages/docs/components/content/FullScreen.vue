<script setup lang="ts">
import { VFullScreen } from 'vue-final-modal'

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: boolean): void
}>()
</script>

<template>
  <VFullScreen
    full-screen-class="bg-primary-50 dark:bg-gray-800"
    @update:model-value="val => emit('update:modelValue', val)"
  >
    <h1 class="text-primary text-lg">
      Full Screen Modal
    </h1>
    <VButton @click="emit('update:modelValue', false)">
      Close
    </VButton>
  </VFullScreen>
</template>
