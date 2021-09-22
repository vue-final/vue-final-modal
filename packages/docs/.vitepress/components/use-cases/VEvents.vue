<template>
  <custom-modal
    v-model="show"
    @click-outside="clickOutside"
    @before-open="beforeOpen"
    @opened="opened"
    @before-close="beforeClose"
    @closed="closed"
    @cancel="show = false"
  >
    <template #title>Events Example!</template>
  </custom-modal>
  <button class="btn btn--highlight" @click="show = true">Open modal</button>
</template>

<script setup>
import { ref } from 'vue'

const show = ref(false)

function clickOutside() {
  alert('click-outside')
}
function beforeOpen() {
  alert('beforeOpen')
}
function opened() {
  alert('opened')
}
function beforeClose() {
  alert('beforeClose')
}
function closed() {
  alert('closed')
}
</script>
