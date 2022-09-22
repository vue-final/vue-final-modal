<script lang="ts" setup>
defineProps<{
  text: string
}>()

const emit = defineEmits<{
  (e: 'create'): void
}>()

emit('create')
</script>

<template>
  <div>default slot component {{ text }}</div>
  <button>Click Button!</button>
</template>

