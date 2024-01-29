<script setup lang="ts">
import { ModalsContainer, VueFinalModal, h, useModal } from 'vue-final-modal'
import DefaultSlot from '../DefaultSlot.vue'

let count = 0

const modal = useModal({
  keepAlive: true,
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
    default: h({
      component: DefaultSlot,
      attrs: {
        text: 'This is an example of a modal with a default slot',
      },
    }),
  },
})
</script>

<template>
  <div style="padding-top: 100px">
    <button @click="() => modal.open()">
      open a modal
    </button>
  </div>

  <ModalsContainer />
</template>

<docs lang="md">
### Markdown docs for Basic example
</docs>
