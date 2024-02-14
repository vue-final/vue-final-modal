<script lang="ts" setup>
import { ref } from 'vue'

defineProps<{
  text: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'create'): void
}>()

emit('create')

const count = ref(0)
</script>

<template>
  <div>
    <div>default slot component {{ text }}</div>
    <input v-model="count" type="number">
    <slot />
    <button @click="() => emit('close')">
      Close
    </button>
  </div>
</template>
