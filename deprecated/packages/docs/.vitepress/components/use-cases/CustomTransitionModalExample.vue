<template>
  <custom-transition-modal v-model="show">
    <p>Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.</p>
  </custom-transition-modal>

  <button class="btn btn--highlight" @click="show = true">Open modal</button>
</template>

<script setup>
import { ref } from 'vue'

const show = ref(false)
</script>
