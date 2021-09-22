<template>
  <vue-final-modal v-model="show">
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
.modal__title {
  font-size: 1.5rem;
  font-weight: 700;
}
</style>
