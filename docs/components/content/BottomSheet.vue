<script setup lang="ts">
import { ModalBottom } from 'vue-final-modal'

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: boolean): void
}>()
</script>

<template>
  <ModalBottom
    @update:model-value="val => emit('update:modelValue', val)"
  >
    <div class="flex justify-center items-center h-60 bg-primary-100 dark:bg-gray-800">
      <VButton @click="emit('update:modelValue', false)">
        Close
      </VButton>
    </div>
  </ModalBottom>
</template>
