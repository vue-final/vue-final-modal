<script setup lang="ts">
const show = ref(false)
</script>

<template>
  <VButton class="p-2 border rounded" @click="show = true">
    Open Modal
  </VButton>

  <MyModal
    v-model="show"
    title="Hello World!"
  >
    <p>The content of the modal</p>
  </MyModal>
</template>
