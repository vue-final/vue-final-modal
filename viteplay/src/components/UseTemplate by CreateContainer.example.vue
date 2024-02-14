<script setup lang="ts">
import { createContainer } from 'vue-final-modal'
import DefaultSlot from './DefaultSlot.vue'

const { Container, useTemplate } = createContainer()

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
