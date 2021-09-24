<template>
  <vue-final-modal
    v-model="show"
    classes="flex justify-center items-center"
    content-class="
      relative
      inline-block p-4
      border rounded bg-white
      dark:bg-gray-900 dark:border-gray-700
    "
  >
    <span class="mr-8 text-2xl font-bold">Hello, vue-final-modal</span>
    <p>Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.</p>
    <button class="absolute top-1 right-1 px-3 py-1 text-3xl leading-none" @click="show = false">×</button>
  </vue-final-modal>

  <button class="btn btn--highlight" @click="show = true">Open modal</button>
</template>

<script setup>
import { ref } from 'vue'
import { VueFinalModal } from 'vue-final-modal'

const show = ref(false)
</script>
