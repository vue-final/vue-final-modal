<template>
  <!-- <v-button class="mb-4" highlight @click="dynamic">Open Dynamic Modal</v-button> -->
  <v-button class="mb-4" highlight @click="show">show Modal</v-button>
  <v-button class="mb-4" highlight @click="hide">hide Modal</v-button>
  <v-button class="mb-4" highlight @click="setOption"
    >Toggle hideOverlay: {{ modal.options.bind.hideOverlay ? 'true' : 'false' }}</v-button
  >
</template>

<script>
import CustomModal from '@/components/use-cases/CustomModal.vue'
import VDescription from '@/components/common/VDescription.vue'
import { useModal } from 'vue-final-modal'
import { markRaw } from 'vue'

export default {
  setup() {
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
      console.log('opened')
    }

    async function hide() {
      await modal.hide()
      console.log('closed')
    }

    function setOption() {
      modal.options.bind.hideOverlay = !modal.options.bind.hideOverlay
    }

    return {
      modal,
      show,
      hide,
      setOption
    }
  }
}
</script>
