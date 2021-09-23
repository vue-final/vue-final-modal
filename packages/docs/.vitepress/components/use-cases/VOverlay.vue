<template>
  <vue-final-modal v-model="show"></vue-final-modal>

  <button class="btn btn--highlight" @click="show = true">Open modal</button>
</template>

<script setup>
import { ref } from 'vue'
import { VueFinalModal } from 'vue-final-modal'

const show = ref(false)
</script>
