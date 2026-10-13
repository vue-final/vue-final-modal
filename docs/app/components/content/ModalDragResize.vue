<script setup lang="ts">
import { useId } from 'vue'
import VueDragResize from 'vue3-drag-resize'
import { VueFinalModal } from 'vue-final-modal'

const titleId = useId()
const width = ref(0)
const height = ref(0)
const top = ref(0)
const left = ref(0)

function dragResize(newRect: { width: number, height: number, top: number, left: number }) {
  width.value = newRect.width
  height.value = newRect.height
  top.value = newRect.top
  left.value = newRect.left
}
</script>

<template>
  <VueFinalModal
    v-slot="{ close }"
    background="interactive"
    content-transition="vfm-fade"
    :hide-overlay="true"
    :aria-labelledby="titleId"
  >
    <!-- <ClientOnly> is only needed with Nuxt -->
    <ClientOnly>
      <VueDragResize
        :is-active="true"
        :w="200"
        :h="200"
        drag-cancel="button"
        class="bg-primary-100 dark:bg-gray-800"
        @resizing="dragResize"
        @dragging="dragResize"
      >
        <h3 :id="titleId">
          Hello World!
        </h3>
        <p>{{ top }} × {{ left }}</p>
        <p>{{ width }} × {{ height }}</p>
        <button type="button" class="absolute top-0 right-0 mt-2 mr-2 px-2 border rounded-md" aria-label="Close" @click="close()">
          ×
        </button>
      </VueDragResize>
    </ClientOnly>
  </VueFinalModal>
</template>
