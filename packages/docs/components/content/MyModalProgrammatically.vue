<script setup lang="ts">
import { useVfm } from 'vue-final-modal'
import MyModal from './MyModal.vue'

const vfm = useVfm()
const { open } = vfm.useModal<InstanceType<typeof MyModal>['$props']>({
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
