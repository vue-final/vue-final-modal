<template>
  <vue-final-modal v-model="show">
    <span class="text-2xl font-bold">Hello, vue-final-modal</span>
  </vue-final-modal>
  
  <button class="btn btn--highlight" @click="show = true">Open modal</button>
</template>

<script setup>
import { ref } from 'vue'
import { VueFinalModal } from 'vue-final-modal'

const show = ref(false)
</script>
