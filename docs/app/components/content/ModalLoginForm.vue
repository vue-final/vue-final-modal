<script setup lang="ts">
import type { FormData } from './LoginFormVorms.vue'
import { useId } from 'vue'
import { VueFinalModal } from 'vue-final-modal'
import LoginFormVorms from './LoginFormVorms.vue'

const emit = defineEmits<{
  (e: 'submit', formData: FormData): void
}>()

const titleId = useId()
</script>

<template>
  <VueFinalModal
    class="flex justify-center items-center"
    content-class="relative w-full max-w-xs mx-4 p-4 rounded-lg bg-white dark:bg-gray-900 border dark:border-gray-700"
    content-transition="vfm-fade"
    overlay-transition="vfm-fade"
    :aria-labelledby="titleId"
  >
    <h1 :id="titleId" class="text-2xl mb-4">
      Login
    </h1>
    <LoginFormVorms @submit="formData => emit('submit', formData)" />
  </VueFinalModal>
</template>
