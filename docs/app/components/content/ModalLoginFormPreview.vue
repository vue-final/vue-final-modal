<script setup lang="ts">
import type { FormData } from './LoginFormVorms.vue'
import { useModal } from 'vue-final-modal'
import ModalLoginForm from './ModalLoginForm.vue'

const submitted = ref('nothing yet')

const { open, close } = useModal({
  component: ModalLoginForm,
  attrs: {
    onSubmit(formData: FormData) {
      submitted.value = JSON.stringify(formData)
      close()
    },
  },
})
</script>

<template>
  <div class="flex flex-wrap items-center justify-center gap-3">
    <VButton @click="() => open()">
      Open Modal
    </VButton>
    <output class="inline-flex items-center gap-1.5 rounded-md border border-default px-2 py-1 text-sm text-muted">
      Submitted: <span class="font-medium text-highlighted">{{ submitted }}</span>
    </output>
  </div>
</template>
