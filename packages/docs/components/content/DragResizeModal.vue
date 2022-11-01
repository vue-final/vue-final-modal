<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'
import VueDragResize from 'vue3-drag-resize'

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: boolean): void
}>()

const width = ref(0)
const height = ref(0)
const top = ref(0)
const left = ref(0)

function dragResize(newRect) {
  width.value = newRect.width
  height.value = newRect.height
  top.value = newRect.top
  left.value = newRect.left
}
</script>

<template>
  <VueFinalModal
    display-directive="show"
    background="interactive"
    :hide-overlay="true"
    @update:model-value="val => emit('update:modelValue', val)"
  >
    <ClientOnly>
      <VueDragResize
        :is-active="true"
        :w="200"
        :h="200"
        class="bg-primary-100 dark:bg-gray-800"
        @resizing="dragResize"
        @dragging="dragResize"
      >
        <h3>Hello World!</h3>
        <p>{{ top }} х {{ left }} </p>
        <p>{{ width }} х {{ height }}</p>
        <button class="absolute top-0 right-0 mt-2 mr-2 px-2 border rounded-md " @click="emit('update:modelValue', false)">
          X
        </button>
      </VueDragResize>
    </ClientOnly>
  </VueFinalModal>
</template>
