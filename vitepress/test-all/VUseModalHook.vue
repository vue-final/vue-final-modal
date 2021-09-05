<template>
  <!-- <v-button class="mb-4" highlight @click="dynamic">Open Dynamic Modal</v-button> -->
  <v-button class="mb-4" highlight @click="show">show Modal</v-button>
  <v-button class="mb-4" highlight @click="hide">hide Modal</v-button>
  <v-button class="mb-4" highlight @click="setOption">Set hideOverlay to true</v-button>
</template>

<script>
import VDescription from '../VDescription.vue'
import { useModal } from 'vue-final-modal'
import { markRaw } from 'vue'

export default {
  data: () => ({
    modal: null
  }),
  mounted() {
    this.init()
  },
  methods: {
    show() {
      this.modal.show().then(() => {
        console.log('opened')
      })
    },
    hide() {
      this.modal.hide().then(() => {
        console.log('hide closed')
      })
    },
    setOption() {
      this.modal.options.bind.hideOverlay = true
    },
    init() {
      this.modal = useModal({
        component: 'CustomModal',
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
            if (!this.asdf) {
              e.stop()
            }
            this.asdf = true
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
    }
  }
}
</script>
