<script setup lang="ts" generic="T extends string">
defineProps<{
  title: T
}>()
</script>

<template>
  <div>{{ title }}</div>
</template>
