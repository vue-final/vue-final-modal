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
          'click-outside'() {
            console.log('@click-outside')
          },
          'before-open'() {
            console.log('@before-open')
          },
          opened() {
            console.log('@opened')
          },
          'before-close'() {
            console.log('@before-close')
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
