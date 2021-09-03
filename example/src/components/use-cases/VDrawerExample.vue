<template>
  <v-drawer v-model="show">
    <h1>Swipe to close modal example</h1>
  </v-drawer>

  <v-button highlight @click="show = true">Open modal</v-button>
  <v-button highlight @click="dynamic">Open dynamic modal</v-button>
</template>

<script>
import { markRaw, ref } from 'vue'
import { $vfm } from 'vue-final-modal'
import VDrawer from './VDrawer.vue'

export default {
  setup() {
    const show = ref(false)

    function dynamic() {
      $vfm.show({
        component: markRaw(VDrawer),
        slots: {
          default: '<h1>Swipe to close dynamic modal example</h1>'
        }
      })
    }
    return {
      show,
      dynamic
    }
  }
}
</script>
