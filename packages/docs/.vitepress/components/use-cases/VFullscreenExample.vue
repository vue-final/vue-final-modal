<template>
  <v-fullscreen v-model="show">
    <div class="py-2 text-center text-lg font-bold">Fullscreen Modal</div>
    <div class="px-4">
      <p v-for="i in 100" :key="i">some content {{ i }}</p>
    </div>
  </v-fullscreen>

  <button class="btn btn--highlight" @click="show = true">Open Panel</button>
</template>

<script setup>
import { ref } from 'vue'

const show = ref(false)
</script>
