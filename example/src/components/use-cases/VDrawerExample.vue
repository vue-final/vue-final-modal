<template>
  <v-drawer v-model="show">
    <h1>Swipe to close modal example</h1>
    <p v-for="i in 100" :key="i">some content {{ i }}</p>
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
          default: `
            <h1>Swipe to close dynamic modal example</h1>
            <p class="h-20">some content</p>
          `
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
