<script setup lang="ts">
defineProps<{ text: string }>()
</script>

<template>
  <dialog open>
    {{ text }}
  </dialog>
</template>
