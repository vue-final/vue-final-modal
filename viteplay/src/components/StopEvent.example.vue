<script setup lang="ts">
import { ModalsContainer, VueFinalModal, defineTemplate, useModal } from 'vue-final-modal'
import DefaultSlot from './DefaultSlot.vue'

let count = 0

const modal = useModal({
  component: VueFinalModal,
  attrs: {
    background: 'interactive',
    contentStyle: { backgroundColor: '#fff' },
    onClosed() {
      count = 0
    },
    onOpened() {
      count = 0
    },
    onBeforeClose({ stop }) {
      count += 1
      if (count < 5) {
        alert(`Modal close stopped ${count} / 4`)
        stop()
      }
    },
    onBeforeOpen({ stop }) {
      count += 1
      if (count < 5) {
        alert(`Modal open stopped ${count} / 4`)
        stop()
      }
    },
  },
  slots: {
    default: defineTemplate({
      component: DefaultSlot,
      attrs: {
        text: 'This is an example of a modal with a default slot',
      },
      emits: {
        onClose: () => modal.close(),
      },
    }),
  },
})
</script>

<template>
  <div>
    <div style="padding-top: 100px">
      <button @click="() => modal.open()">
        open a modal
      </button>
    </div>
    <ModalsContainer />
  </div>
</template>

<docs lang="md">
### Markdown docs for Basic example
</docs>
