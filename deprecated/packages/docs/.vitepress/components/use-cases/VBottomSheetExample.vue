<template>
  <VBottomSheet 
    v-model="show"
    swipeToCloseDirection="DOWN"
    bottomSheetClass="bg-white dark:bg-gray-900"
  >
    <div class="py-2 text-center text-lg font-bold">Bottom Sheet Modal</div>
    <div class="px-4">
      <p v-for="i in 100" :key="i">some content {{ i }}</p>
    </div>
    <template #swipe-banner>
      <div class="w-4 h-full bg-red-300"></div>
    </template>
  </VBottomSheet>

  <button class="btn btn--highlight" @click="show = true">Open Panel</button>
</template>

<script setup>
import { ref } from 'vue'

const show = ref(false)
</script>
