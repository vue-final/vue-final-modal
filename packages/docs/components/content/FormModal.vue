<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'
import type { FormData } from './FormLogin.vue'
import FormLogin from './FormLogin.vue'

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: boolean): void
  (e: 'submit', formData: FormData): void
}>()
</script>

<template>
  <VueFinalModal
    class="flex justify-center items-center"
    content-style="background: #344951;"
    content-class="p-4 rounded-lg"
    @update:model-value="val => emit('update:modelValue', val)"
  >
    <div class="flex justify-between items-center mb-4 text-2xl text-white">
      <h1>Login</h1>
      <button>x</button>
    </div>
    <FormLogin @submit="formData => emit('submit', formData)" />
  </VueFinalModal>
</template>
