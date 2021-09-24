<template>
  <v-panel v-model="show">
    <div class="py-2 text-cool-gray-800 text-center text-lg font-bold">Panel</div>
    <div class="px-4">
      <p v-for="i in 100" :key="i" class="text-cool-gray-800">some content {{ i }}</p>
    </div>
  </v-panel>

  <button class="btn btn--highlight" @click="show = true">Open Panel</button>
</template>

<script setup>
import { ref } from 'vue'

const show = ref(false)
</script>
