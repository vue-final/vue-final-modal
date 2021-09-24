<template>
  <custom-modal v-model="show" focus-trap @confirm="show = false" @cancel="show = false">
    <template #title>Hello, vue-final-modal</template>
    <p>Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.</p>
  </custom-modal>

  <button class="btn btn--highlight" @click="show = true">Open modal</button>
</template>

<script setup>
import { ref } from 'vue'

const show = ref(false)
</script>
