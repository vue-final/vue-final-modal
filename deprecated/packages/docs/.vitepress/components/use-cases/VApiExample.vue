<template>
  <VModal
    v-model="show"
    name="ModalName"
    title="API example"
    @confirm="$vfm.hide('ModalName')"
    @cancel="$vfm.hide('ModalName')"
  >
    Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.
  </VModal>

  <button class="btn btn--highlight" @click="openModal">Open confirm dialog</button>
</template>

<script setup>
import { ref } from 'vue'
import { $vfm } from 'vue-final-modal'

const show = ref(false)

function openModal() {
    $vfm.show('ModalName').then(() => {
      // do something when modal is opened
    })
  }
</script>
