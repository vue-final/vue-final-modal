<script setup lang="ts">
import { ref } from 'vue'
import { VueFinalModal } from '~/index'

const first = ref(false)
const second = ref(false)
</script>

<template>
  <button class="open-first" @click="first = true">
    Open first
  </button>
  <VueFinalModal
    v-model="first"
    content-class="first-modal"
    content-transition="vfm-fade"
    overlay-transition="vfm-fade"
  >
    <button class="open-second" @click="second = true">
      Open second
    </button>
    <VueFinalModal
      v-model="second"
      modal-id="second"
      content-class="second-modal"
      content-transition="vfm-fade"
      overlay-transition="vfm-fade"
    >
      <button class="close-second" @click="second = false">
        Close second
      </button>
    </VueFinalModal>
  </VueFinalModal>
</template>
