<template>
  <vue-final-modal v-model="show" content-class="modal-content">
    <span class="modal__title">Hello, vue-final-modal</span>
  </vue-final-modal>
  <button class="btn btn--highlight" @click="show = true">Open modal</button>
</template>

<script setup>
import { ref } from 'vue'
import { VueFinalModal } from 'vue-final-modal'

const show = ref(false)
</script>

<style scoped>
:deep(.modal-content) {
  display: inline-block;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  background: #fff;
}
.modal__title {
  font-size: 1.5rem;
  font-weight: 700;
}
</style>

<style scoped>
.dark div :deep(.modal-content) {
  border-color: #2d3748;
  background-color: #1a202c;
}
</style>
