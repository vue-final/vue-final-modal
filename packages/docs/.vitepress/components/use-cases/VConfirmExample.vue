<template>
  <v-confirm
    v-model="show"
    @confirm="show = false"
    @cancel="show = false"
  ></v-confirm>

  <button class="btn btn--highlight" @click="show = true">Open confirm dialog</button>
</template>

<script setup>
import { ref } from 'vue'

const show = ref(false)
</script>
