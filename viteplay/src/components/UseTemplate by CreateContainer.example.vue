<script setup lang="ts">
import { Container, useTemplate } from 'vue-final-modal'
import DefaultSlot from './DefaultSlot.vue'

function appendTemplate() {
  const { show, hide } = useTemplate({
    component: DefaultSlot,
    attrs: {
      text: 'appendComponent',
      onClose: () => hide(),
    },
  })

  show()
}
</script>

<template>
  <button @click="() => appendTemplate()">
    appendTemplate
  </button>

  <Container />
</template>
