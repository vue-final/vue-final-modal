<template>
  <v-button class="mb-4" highlight @click="dynamic">Open Dynamic Modal</v-button>
</template>

<script>
import { markRaw } from 'vue'
import { $vfm } from 'vue-final-modal'
import VDynamicModal from './VDynamicModal.vue'

export default {
  setup() {
    function dynamic() {
      $vfm.show({
        component: markRaw(VDynamicModal)
      })
    }
    return {
      dynamic
    }
  }
}
</script>
