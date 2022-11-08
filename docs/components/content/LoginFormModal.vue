<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'
import type { FormData } from './LoginForm.vue'
import LoginForm from './LoginForm.vue'

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: boolean): void
  (e: 'submit', formData: FormData): void
}>()
</script>

<template>
  <VueFinalModal
    class="flex justify-center items-center"
    content-class="relative p-4 rounded-lg bg-white dark:bg-gray-900"
    @update:model-value="val => emit('update:modelValue', val)"
  >
    <LoginForm @submit="formData => emit('submit', formData)" />
    <button class="absolute top-4 right-4 w-8 h-8 text-2xl">x</button>
  </VueFinalModal>
</template>
