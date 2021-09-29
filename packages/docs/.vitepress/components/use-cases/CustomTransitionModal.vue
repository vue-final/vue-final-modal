<template>
  <vue-final-modal
    v-bind="$attrs"
    classes="flex justify-center items-center"
    content-class="
      relative flex flex-col max-h-full mx-4 p-4 
      border rounded bg-white
      dark:border-gray-800 dark:bg-gray-900
    "
    :transition="{
      'enter-active-class': 'transition duration-200 ease-in-out transform',
      'enter-from-class': 'translate-y-full',
      'enter-to-class': 'translate-y-0',
      'leave-active-class': 'transition duration-200 ease-in-out transform',
      'leave-to-class': 'translate-y-full',
      'leave-from-class': 'translate-y-0'
    }"
  >
    <slot></slot>
  </vue-final-modal>
</template>

<script setup>
import { VueFinalModal } from 'vue-final-modal'
</script>
