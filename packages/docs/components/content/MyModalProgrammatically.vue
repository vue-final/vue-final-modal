<script setup lang="ts">
import { markRaw } from 'vue'
import { useModal } from 'vue-final-modal'
import MyModal from './MyModal.vue'

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
  <VButton class="p-2 border rounded" @click="() => open()">
    Open Modal
  </VButton>

  <ModalsContainer />
</template>
