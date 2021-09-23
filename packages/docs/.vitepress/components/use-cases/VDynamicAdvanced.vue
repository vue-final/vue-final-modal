<template>
  <button class="btn btn--highlight mb-4" highlight @click="dynamic">Open Dynamic Modal</button>
</template>

<script setup>
import CustomModal from '@/components/use-cases/CustomModal.vue'
import VTitle from '@/components/common/VTitle.vue'
import VDescription from '@/components/common/VDescription.vue'

import { $vfm } from 'vue-final-modal'
import { markRaw } from 'vue'

function dynamic() {
  $vfm.show({
    component: markRaw(CustomModal),
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
        component: markRaw(VTitle),
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
</script>
