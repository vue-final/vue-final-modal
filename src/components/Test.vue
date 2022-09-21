<script lang="ts" setup>
defineProps<{
  text: string
}>()

const emit = defineEmits<{
  (e: 'onCreate'): void
}>()

emit('onCreate')
</script>

<template>
  <div>test component {{ text }}</div>
  <button>Click Button!</button>
</template>
