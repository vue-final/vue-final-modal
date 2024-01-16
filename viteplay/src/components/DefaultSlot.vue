<script lang="ts" setup>
import { ref } from 'vue'

defineProps<{
  text: string
}>()

const emit = defineEmits<{
  (e: 'create'): void
}>()

emit('create')

const count = ref(0)
</script>

<template>
  <div style="height: 500px;">
    <div>default slot component {{ text }}</div>
    <button>Click Button!</button>
    <input v-model="count" type="number">
    <slot />
  </div>
</template>
