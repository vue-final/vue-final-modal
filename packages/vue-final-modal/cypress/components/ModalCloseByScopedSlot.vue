<script setup lang="ts">
import { VueFinalModal } from '~/index'
</script>

<template>
  <VueFinalModal v-slot="{ close }">
    <button @click="() => close()">
      Close
    </button>
  </VueFinalModal>
</template>
