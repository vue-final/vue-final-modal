<template>
  <!-- <button class="btn btn--highlight mb-4" @click="dynamic">Open Dynamic Modal</button> -->
  <button class="btn btn--highlight mb-4" @click="show">show Modal</button>
  <button class="btn btn--highlight mb-4" @click="hide">hide Modal</button>
  <button class="btn btn--highlight mb-4" @click="setOption">
    Toggle hideOverlay: {{ modal.options.bind.hideOverlay ? 'true' : 'false' }}
  </button>
</template>

<script setup>
import CustomModal from '@/components/use-cases/CustomModal.vue'
import VDescription from '@/components/common/VDescription.vue'
import { useModal } from 'vue-final-modal'
import { markRaw } from 'vue'

const modal = useModal({
  component: markRaw(CustomModal),
  bind: {
    preventClick: true
  },
  on: {
    // event by custom-modal
    confirm(close) {
      console.log('confirm')
      close()
    },
    cancel(close) {
      console.log('cancel')
      close()
    },
    // event by vue-final-modal
    clickOutside() {
      console.log('@clickOutside')
    },
    beforeOpen() {
      console.log('@beforeOpen')
    },
    opened() {
      console.log('@opened')
    },
    beforeClose: e => {
      console.log('@beforeClose')
    },
    closed() {
      console.log('@closed')
    }
  },
  slots: {
    title: {
      component: 'VTitle',
      bind: {
        text: 'Hello, vue-final-modal'
      }
    },
    default: {
      component: markRaw(VDescription),
      bind: {
        content: 'Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.'
      }
    }
  }
})

async function show() {
  await modal.show()
}

async function hide() {
  await modal.hide()
}

function setOption() {
  modal.options.bind.hideOverlay = !modal.options.bind.hideOverlay
}
</script>
