<template>
  <VFullScreen 
    v-model="show"
    :canSwipeToClose="true"
    closeDirection="RIGHT"
    :escToClose="true"
    fullScreenClass="bg-white dark:bg-gray-900"
  >
    <div class="py-2 text-center text-lg font-bold">Fullscreen Modal</div>
    <div class="px-4">
      <p v-for="i in 100" :key="i">some content {{ i }}</p>
    </div>
  </VFullScreen>

  <button class="btn btn--highlight" @click="show = true">Open Panel</button>
</template>

<script setup>
import { ref } from 'vue'

const show = ref(false)
</script>
