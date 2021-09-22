<template>
  <button class="btn btn--highlight mb-4" @click="dynamic">Open Dynamic Modal</button>
</template>

<script setup>
import { markRaw } from 'vue'
import { $vfm } from 'vue-final-modal'
import VDynamicModal from './VDynamicModal.vue'

function dynamic() {
  $vfm.show({
    component: markRaw(VDynamicModal)
  })
}
</script>
