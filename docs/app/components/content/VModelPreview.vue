<script setup lang="ts">
import { ref } from 'vue'
import ModalConfirm from './ModalConfirm.vue'

const show = ref(false)

function confirm() {
  show.value = false
}
</script>

<template>
  <VButton @click="show = true">
    Open Modal
  </VButton>

  <ModalConfirm
    v-model="show"
    title="Hello World!"
    @confirm="() => confirm()"
  >
    <p>The content of the modal</p>
  </ModalConfirm>
</template>
