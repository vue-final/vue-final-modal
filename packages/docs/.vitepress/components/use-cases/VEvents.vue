<template>
  <vue-final-modal
    v-model="show"
    classes="vfm-container"
    content-class="vfm-content"
    @clickOutside="clickOutside"
    @beforeOpen="beforeOpen"
    @opened="opened"
    @beforeClose="beforeClose"
    @closed="closed"
  >
    <h3>Confirm</h3>
    <p>Are you sure?</p>
    <div class="flex justify-end space-x-2">
      <button class="btn-primary" @click="show = false">Confirm</button>
      <button class="btn-secondary" @click="show = false">Cancel</button>
    </div>
    <button class="btn-close" @click="show = false">×</button>
  </vue-final-modal>

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

<style scoped>
:deep(.vfm-container) {
  @apply flex justify-center items-center;
}
:deep(.vfm-content) {
  @apply relative min-w-80 max-h-2/3 p-4 rounded-lg bg-white;
}
:global(.dark .vfm-content) {
  @apply bg-gray-900;
}

h3 {
  @apply m-0 text-3xl;
}
p {
  @apply m-0 py-4;
}
.btn-primary,
.btn-secondary {
  @apply px-2 py-1 border rounded font-medium;
}
.btn-primary {
  @apply text-light-300 bg-green-500 border-green-500;
}
.btn-close {
  @apply absolute top-2 right-2 p-2 text-xl;
}
</style>
