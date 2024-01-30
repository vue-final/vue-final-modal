<script setup lang="ts">
import { ModalsContainer, useTemplate } from 'vue-final-modal'
import DefaultSlot from './DefaultSlot.vue'

const { show, hide } = useTemplate({
  component: DefaultSlot,
  attrs: {
    text: '123',
  },
})
</script>

<template>
  <button @click="() => show()">
    show
  </button>
  <button @click="() => hide()">
    hide
  </button>

  <ModalsContainer />
</template>
