<script setup lang="ts">
import { ModalsContainer, useModal } from 'vue-final-modal'
import Fullscreen from './Fullscreen.vue'

const { open } = useModal({
  component: Fullscreen,
})
</script>

<template>
  <VButton @click="open">
    Open Modal
  </VButton>

  <ModalsContainer />
</template>
