<template>
  <v-confirm
    v-model="show"
    title="Confirm"
    @confirm="show = false"
    @cancel="show = false"
  >
    <span>Are you sure?</span>
  </v-confirm>

  <button class="btn btn--highlight" @click="show = true">Open confirm dialog</button>
</template>

<script setup>
import { ref } from 'vue'

const show = ref(false)
</script>
