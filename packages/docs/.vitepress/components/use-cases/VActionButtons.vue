<template>
  <vue-final-modal
    v-model="show"
    classes="flex justify-center items-center"
    content-class="
      relative
      flex flex-col max-h-[90%] mx-4 p-4
      border rounded bg-white
      dark:bg-gray-900 dark:border-gray-700
    "
  >
    <span class="mr-8 text-2xl font-bold">Hello, vue-final-modal</span>
    <div class="flex-1 overflow-auto">
      <p v-for="i in 100" :key="i">
        Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.
      </p>
    </div>
    <div class="flex-shrink-0 flex justify-center pt-4">
      <button class="btn" @click="show = false">confirm</button>
      <button class="btn" @click="show = false">cancel</button>
    </div>
    <button class="absolute top-1 right-1 px-3 py-1 text-3xl leading-none" @click="show = false">×</button>
  </vue-final-modal>

  <button class="btn btn--highlight" @click="show = true">Open modal</button>
</template>

<script setup>
import { ref } from 'vue'
import { VueFinalModal } from 'vue-final-modal'

const show = ref(false)
</script>
