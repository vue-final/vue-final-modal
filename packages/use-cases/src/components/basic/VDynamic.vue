<template>
  <v-button class="mb-4" highlight @click="dynamic">Open Dynamic Modal</v-button>
</template>

<script>
import { $vfm } from 'vue-final-modal'

export default {
  methods: {
    dynamic() {
      $vfm.show({
        component: 'VDynamicModal'
      })
    }
  }
}
</script>
