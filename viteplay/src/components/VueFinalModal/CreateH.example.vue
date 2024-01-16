<script setup lang="ts">
import { ModalsContainer, useModal } from 'vue-final-modal'
import DefaultSlot from '../DefaultSlot.vue'

useModal({
  defaultModelValue: true,
  component: DefaultSlot,
  attrs: {
    text: '123',
    onCreate() {
      // console.log('onCreated')
    },
  },
})
</script>

<template>
  <ModalsContainer />
</template>
