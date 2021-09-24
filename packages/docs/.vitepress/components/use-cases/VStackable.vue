<template>
  <!-- First modal -->
  <vue-final-modal
    v-model="showFirst"
    classes="flex justify-center items-center"
    content-class="
      relative
      flex flex-col max-h-[90%] mx-4 p-4
      border rounded bg-white
      dark:bg-gray-900 dark:border-gray-700
    "
  >
    <span class="mr-8 text-2xl font-bold">First Modal</span>
    <div class="flex-1 overflow-auto">
      <p v-for="i in 5" :key="i">
        Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.
      </p>
    </div>
    <div class="flex-shrink-0 flex justify-center pt-4">
      <button class="btn btn--highlight" @click="showSecond = true">confirm</button>
      <button class="btn" @click="showFirst = false">cancel</button>
    </div>
    <button class="absolute top-1 right-1 px-3 py-1 text-3xl leading-none" @click="showFirst = false">×</button>
  </vue-final-modal>

  <!-- Second modal -->
  <vue-final-modal
    v-model="showSecond"
    classes="flex justify-center items-center"
    content-class="
      relative
      flex flex-col max-h-[90%] mx-4 p-4
      border rounded bg-white
      dark:bg-gray-900 dark:border-gray-700
    "
  >
    <span class="mr-8 text-2xl font-bold">Second Modal</span>
    <p>Confirm to submit.</p>
    <div class="flex-shrink-0 flex justify-center pt-4">
      <button class="btn" @click="confirm">confirm</button>
      <button class="btn" @click="showSecond = false">cancel</button>
    </div>
    <button class="absolute top-1 right-1 px-3 py-1 text-3xl leading-none" @click="showSecond = false">×</button>
  </vue-final-modal>

  <button class="btn btn--highlight" @click="showFirst = true">Open modal</button>
</template>

<script setup>
import { ref } from 'vue'
import { VueFinalModal } from 'vue-final-modal'

const showFirst = ref(false)
const showSecond = ref(false)

function confirm() {
  showFirst.value = false
  showSecond.value = false
}
</script>
