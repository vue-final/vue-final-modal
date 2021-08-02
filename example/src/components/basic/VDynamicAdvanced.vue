<template>
  <v-button class="mb-4" highlight @click="dynamic">Open Dynamic Modal</v-button>
</template>

<script>
import VDescription from '../VDescription.vue'

export default {
  methods: {
    dynamic() {
      this.$vfm.show({
        component: 'CustomModal',
        bind: {
          name: 'VDynamicAdvacedModal'
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
          beforeClose() {
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
            component: VDescription,
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
