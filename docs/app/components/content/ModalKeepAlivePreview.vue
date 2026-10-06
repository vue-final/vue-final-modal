<script setup lang="ts">
import { useModal } from 'vue-final-modal'
import ModalKeepAlive from './ModalKeepAlive.vue'

const keptAlive = useModal({
  keepAlive: true,
  component: ModalKeepAlive,
  attrs: {
    title: 'keepAlive: true',
    onClose() {
      keptAlive.close()
    },
  },
})

const unmountedOnClose = useModal({
  component: ModalKeepAlive,
  attrs: {
    title: 'keepAlive: false (default)',
    onClose() {
      unmountedOnClose.close()
    },
  },
})
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <VButton @click="() => keptAlive.open()">
      Open kept-alive modal
    </VButton>
    <VButton @click="() => unmountedOnClose.open()">
      Open default modal
    </VButton>
    <VButton @click="() => keptAlive.destroy()">
      Destroy kept-alive modal
    </VButton>
  </div>
</template>
