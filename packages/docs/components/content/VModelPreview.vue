<script setup lang="ts">
const show = ref(false)

function confirm() {
  alert('confirm')
  show.value = false
}
</script>

<template>
  <VButton class="p-2 border rounded" @click="show = true">
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
