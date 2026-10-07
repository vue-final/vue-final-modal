<script setup lang="ts">
import { VueFinalModal } from '~/index'

defineProps<{
  title?: string
  contentClass?: string
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
}>()
</script>

<template>
  <VueFinalModal
    :content-class="contentClass"
    content-transition="vfm-fade"
    overlay-transition="vfm-fade"
    style="display: flex; justify-content: center; align-items: center;"
  >
    <template #default="{ close }">
      <h1>{{ title }}</h1>
      <slot />
      <button class="confirm" @click="emit('confirm')">
        Confirm
      </button>
      <button class="cancel" @click="() => close()">
        Cancel
      </button>
    </template>
  </VueFinalModal>
</template>
