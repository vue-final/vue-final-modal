<template>
  <vue-final-modal
    v-bind="$attrs"
    classes="flex justify-center items-center"
    content-class="
      relative
      flex flex-col max-h-[90%] mx-4 p-4
      border rounded bg-white
      dark:bg-gray-900 dark:border-gray-700
    "
  >
    <span class="mr-8 text-2xl font-bold">{{ title }}</span>
    <div class="flex-1 overflow-auto">
      <slot></slot>
    </div>
    <div class="flex-shrink-0 flex justify-center pt-4">
      <button class="btn btn--highlight" @click="emit('confirm')">confirm</button>
      <button class="btn" @click="emit('cancel')">cancel</button>
    </div>
    <button class="absolute top-1 right-1 px-3 py-1 text-3xl leading-none" @click="emit('update:modelValue', false)">
      ×
    </button>
  </vue-final-modal>
</template>

<script setup>
import { VueFinalModal } from 'vue-final-modal'

const props = defineProps({
  title: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['confirm', 'cancel'])
</script>
