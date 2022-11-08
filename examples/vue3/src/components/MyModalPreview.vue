<script setup lang="ts">
import { markRaw } from 'vue'
import { useModal } from 'vue-final-modal'
import MyModal from './MyModal.vue'
import VButton from './VButton.vue'

const { open } = useModal<InstanceType<typeof MyModal>['$props']>({
  component: markRaw(MyModal),
  attrs: {
    title: 'Hello World!',
  },
  slots: {
    default: '<p>The content of the modal</p>',
  },
})
</script>

<template>
  <VButton @click="() => open()">
    Open Modal
  </VButton>
</template>
