<template>
  <button class="vfm-btn mb-4" @click="dynamic">Open Dynamic Modal</button>
</template>

<script>
import VDescription from '../VDescription.vue'

export default {
  methods: {
    dynamic() {
      this.$vfm.show({
        component: 'VModal',
        bind: {
          name: 'VDynamicAdvacedModal'
        },
        on: {
          // event by v-modal
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
