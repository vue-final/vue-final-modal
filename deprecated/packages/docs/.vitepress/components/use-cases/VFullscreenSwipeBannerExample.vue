<template>
  <VFullScreen 
    v-model="show"
    :canSwipeToClose="true"
    closeDirection="RIGHT"
    :escToClose="true"
    fullScreenClass="bg-white dark:bg-gray-900"
    :showSwipeBanner="showSwipeBanner"
  >
    <div class="py-2 text-center text-lg font-bold">Fullscreen Modal</div>
      <button class="ml-32 btn btn--highlight" @click="showSwipeBanner = !showSwipeBanner">toggle Swipe Banner</button>
    <div class="px-4">
      <p v-for="i in 100" :key="i">some content {{ i }}</p>
    </div>
    <template #swipe-banner>
      <div class="fixed top-0 left-0 bottom-0 w-7 z-10 bg-red-600 opacity-30"></div>
    </template>
  </VFullScreen>

  <button class="btn btn--highlight" @click="show = true">Open Panel</button>
</template>

<script setup>
import { ref } from 'vue'

const show = ref(false)
const showSwipeBanner = ref(true)
</script>
