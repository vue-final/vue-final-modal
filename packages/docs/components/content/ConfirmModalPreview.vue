<script setup lang="ts">
const show = ref(false)

function confirm() {
  alert('confirm')
  show.value = false
}
</script>

<template>
  <VButton @click="show = true">
    Open Modal
  </VButton>

  <ConfirmModal
    v-model="show"
    title="Hello World!"
    @confirm="() => confirm()"
  >
    <p>The content of the modal</p>
  </ConfirmModal>
</template>
