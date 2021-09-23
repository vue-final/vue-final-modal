<template>
  <!-- First modal -->
  <VModal v-model="showFirst" title="First Modal" @confirm="showSecond = true" @cancel="showFirst = false">
    <p v-for="i in 5" :key="i">
      Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.
    </p>
  </VModal>

  <!-- Second modal -->
  <VModal v-model="showSecond" title="Second Modal" @confirm="confirm" @cancel="showSecond = false">
    <p>Confirm to submit.</p>
  </VModal>

  <button class="btn btn--highlight" @click="showFirst = true">Open modal</button>
</template>

<script setup>
import { ref } from 'vue'
import { VueFinalModal } from 'vue-final-modal'

const showFirst = ref(false)
const showSecond = ref(false)

function confirm() {
  showFirst.value = false
  showSecond.value = false
}
</script>
