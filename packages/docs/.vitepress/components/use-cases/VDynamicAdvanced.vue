<template>
  <button class="btn btn--highlight mb-4" highlight @click="show">Open Dynamic Modal</button>
</template>

<script setup>
import VModal from '@/components/use-cases/VModal.vue'
import VDescription from '@/components/common/VDescription.vue'

import { useModal } from 'vue-final-modal'
import { markRaw } from 'vue'

const { show, hide } = useModal({
  component: markRaw(VModal),
  bind: {
    // Bind prop to VModal
    title: 'Hello, vue-final-modal',

    // Overwrite prop to VueFinalModal
    name: 'VDynamicAdvacedModal'
  },
  on: {
    // Listen events to VModal
    confirm() {
      hide()
    },
    cancel() {
      hide()
    },
    // Listen events to VueFinalModal
    clickOutside() {},
    beforeOpen() {},
    opened() {},
    beforeClose() {},
    closed() {}
  },
  slots: {
    default: {
      component: markRaw(VDescription),
      bind: {
        // Bind props to VDescription
        content: 'Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.'
      },
      on: {
        // Listen events to VDescription
      }
    }
  }
})
</script>
