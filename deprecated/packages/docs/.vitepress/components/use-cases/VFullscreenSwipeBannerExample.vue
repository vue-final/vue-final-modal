<template>
  <VFullScreen 
    v-model="show"
    :canSwipeToClose="true"
    closeDirection="RIGHT"
    :escToClose="true"
    fullScreenClass="bg-white dark:bg-gray-900"
    swipeBannerWidth="50px"
  >
    <div class="py-2 text-center text-lg font-bold">Fullscreen Modal</div>
    <div class="px-4">
      <p v-for="i in 100" :key="i">some content {{ i }}</p>
  </div>
    <template #swipe-banner>
      <div class="absolute top-0 left-0 w-20 h-full bg-red-200 text-black z-10">Swipe here</div>
    </template>
  </VFullScreen>

  <button class="btn btn--highlight" @click="show = true">Open Panel</button>
</template>

<script setup>
import { ref } from 'vue'

const show = ref(false)
</script>
