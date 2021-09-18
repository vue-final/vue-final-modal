<template>
  <v-panel v-model="show">
    <div class="py-2 text-cool-gray-800 text-center text-lg font-bold">Panel</div>
    <div class="px-4">
      <p v-for="i in 100" :key="i" class="text-cool-gray-800">some content {{ i }}</p>
    </div>
  </v-panel>

  <v-button highlight @click="show = true">Open modal</v-button>
  <v-button highlight @click="dynamic">Open dynamic modal</v-button>
</template>

<script>
import { markRaw, ref } from 'vue'
import { $vfm } from 'vue-final-modal'
import VPanel from './VPanel.vue'

export default {
  setup() {
    const show = ref(false)

    function dynamic() {
      $vfm.show({
        component: markRaw(VPanel),
        slots: {
          default: `
            <div class="py-2 text-cool-gray-800 text-center text-lg font-bold">Panel</div>
            <div class="px-4">
              <p class="text-cool-gray-800">some content</p>
              <p class="text-cool-gray-800">some content</p>
              <p class="text-cool-gray-800">some content</p>
            </div>
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
