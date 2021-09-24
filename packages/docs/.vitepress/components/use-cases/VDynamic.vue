<template>
  <button class="btn btn--highlight" @click="show">Open Dynamic Modal</button>
  <button class="btn" @click="options.bind.hideOverlay = !options.bind.hideOverlay">
    Options => hideOverlay: {{ options.bind.hideOverlay }}
  </button>
</template>

<script setup>
import { markRaw } from 'vue'
import { useModal } from 'vue-final-modal'
import VConfirm from '@/components/use-cases/VConfirm.vue'

const { show, hide, options } = useModal({
  component: markRaw(VConfirm),
  bind: {
    hideOverlay: true
  },
  on: {
    confirm() {
      hide()
    },
    cancel() {
      hide()
    }
  }
})
</script>
