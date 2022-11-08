<script setup lang="ts">
const show = ref(false)

function confirm() {
  show.value = false
}
</script>

<template>
  <VButton @click="show = true">
    Open Modal by v-model
  </VButton>

  <ConfirmModal
    v-model="show"
    title="Hello World!"
    @confirm="() => confirm()"
  >
    <p>VModel: The content of the modal</p>
  </ConfirmModal>
</template>
