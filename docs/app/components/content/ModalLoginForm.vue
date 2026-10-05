<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'
import type { FormData } from './LoginFormVorms.vue'
import LoginFormVorms from './LoginFormVorms.vue'

const emit = defineEmits<{
  (e: 'submit', formData: FormData): void
}>()
</script>

<template>
  <VueFinalModal
    class="flex justify-center items-center"
    content-class="relative p-4 rounded-lg bg-white dark:bg-gray-900"
    content-transition="vfm-fade"
    overlay-transition="vfm-fade"
  >
    <LoginFormVorms @submit="formData => emit('submit', formData)" />
  </VueFinalModal>
</template>
