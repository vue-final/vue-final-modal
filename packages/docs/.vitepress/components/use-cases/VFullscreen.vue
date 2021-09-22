<template>
  <vue-final-modal
    v-bind="$attrs"
    content-class="relative w-full h-full p-4 overflow-y-auto bg-white dark:bg-gray-900"
    focus-trap
  >
    <slot></slot>
    <button class="absolute top-2 right-2 p-2 text-2xl" @click="$emit('update:modelValue', false)">x</button>
  </vue-final-modal>
</template>

<script setup>
import { VueFinalModal } from 'vue-final-modal'
</script>
