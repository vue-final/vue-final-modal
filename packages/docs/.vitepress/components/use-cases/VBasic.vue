<template>
  <vue-final-modal v-model="showModal">
    <span class="modal__title">Hello, vue-final-modal</span>
  </vue-final-modal>
  <v-button highlight @click="showModal = true">Open modal</v-button>
</template>

<script setup>
import { ref } from 'vue'
const showModal = ref(false)
</script>

<style scoped>
.modal__title {
  font-size: 1.5rem;
  font-weight: 700;
}
</style>
