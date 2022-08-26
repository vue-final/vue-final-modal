<template>
  <vue-final-modal
    v-model="show"
    content-class="
      inline-block p-4
      border rounded bg-white
      dark:bg-gray-900 dark:border-gray-700
    "
  >
    <span class="text-2xl font-bold">Hello, vue-final-modal</span>
  </vue-final-modal>

  <button class="btn btn--highlight" @click="show = true">Open modal</button>
</template>

<script setup>
import { ref } from 'vue'
import { VueFinalModal } from 'vue-final-modal'

const show = ref(false)
</script>
