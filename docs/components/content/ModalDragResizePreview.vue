<script setup lang="ts">
import { ModalsContainer } from 'vue-final-modal'
import ModalDragResize from './ModalDragResize.vue'

const show = ref(false)
</script>

<template>
  <VButton @click="show = true">
    Open Modal
  </VButton>

  <ModalDragResize v-model="show" />

  <ModalsContainer />
</template>
