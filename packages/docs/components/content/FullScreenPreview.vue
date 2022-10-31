<script setup lang="ts">
import { ModalsContainer, useModal } from 'vue-final-modal'
import FullScreen from './FullScreen.vue'

const { open } = useModal({
  component: markRaw(FullScreen),
})
</script>

<template>
  <VButton @click="open">
    Open Modal
  </VButton>

  <ModalsContainer />
</template>
