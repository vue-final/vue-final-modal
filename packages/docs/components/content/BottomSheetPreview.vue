<script setup lang="ts">
import { ModalsContainer, useModal } from 'vue-final-modal'
import BottomSheet from './BottomSheet.vue'

const { open } = useModal({
  component: markRaw(BottomSheet),
})
</script>

<template>
  <VButton @click="open">
    Open Modal
  </VButton>

  <ModalsContainer />
</template>
