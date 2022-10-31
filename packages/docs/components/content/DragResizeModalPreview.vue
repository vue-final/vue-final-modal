<script setup lang="ts">
const show = ref(false)
</script>

<template>
  <VButton class="p-2 border rounded" @click="show = true">
    Open Modal
  </VButton>

  <DragResizeModal v-model="show" />
</template>
