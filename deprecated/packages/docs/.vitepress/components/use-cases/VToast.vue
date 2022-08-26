<template>
  <vue-final-modal
    v-bind="$attrs"
    hide-overlay
    non-modal
    :lock-scroll="false"
    :click-to-close="false"
    z-index-base="2000"
    classes="flex justify-center items-center"
    content-class="
      max-w-48 max-h-full min-h-[2.625rem] m-0 p-3 
      !pointer-events-none
      rounded-lg border border bg-white dark:border-gray-700 dark:bg-gray-900"
  >
    <span>{{ message }}</span>
  </vue-final-modal>
</template>

<script setup>
import { onMounted } from 'vue'
import { VueFinalModal } from 'vue-final-modal'

const props = defineProps({
  message: {
    type: String,
    default: ''
  },
  timeout: {
    type: Number,
    default: 3000
  }
})

const emits = defineEmits(['update:modelValue'])

onMounted(() => {
  setTimeout(() => {
    emits('update:modelValue')
  }, props.timeout)
})
</script>
