<template>
  <custom-modal v-model="show" @confirm="confirm" @cancel="cancel">
    <template #title>Hello, vue-final-modal</template>
    <p>Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.</p>
  </custom-modal>

  <button class="btn btn--highlight" @click="show = true">Open modal</button>
</template>

<script setup>
import { ref } from 'vue'

const show = ref(false)

function confirm() {
  // some code...
  this.show = false
}

function cancel(close) {
  // some code...
  close()
}
</script>
