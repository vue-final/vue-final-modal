<script setup lang="ts">
import { ModalsContainer, VueFinalModal, useModal, useModalSlot } from 'vue-final-modal'
import DefaultSlot from '../DefaultSlot.vue'

let count = 1

const modal = useModal({
  keepAlive: true,
  component: VueFinalModal,
  attrs: {
    background: 'interactive',
    contentStyle: { backgroundColor: '#fff' },
    onClosed() {
      count = 1
    },
    onOpened() {
      count = 1
    },
    onBeforeClose({ stop }) {
      count += 1
      if (count <= 5) {
        console.log('Modal close stopped')
        stop()
      }
    },
    onBeforeOpen({ stop }) {
      count += 1
      if (count <= 5) {
        console.log('Modal Open stopped')
        stop()
      }
    },
  },
  slots: {
    default: useModalSlot({
      component: DefaultSlot,
      attrs: {
        text: '123',
        onCreate() {
          // console.log('onCreated')
        },
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
