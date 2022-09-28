<script lang="ts" setup>
import { ModalsContainer, VBottomSheet, VueFinalModal, useModal } from 'vue-final-modal'

const modal = useModal<InstanceType<typeof VBottomSheet>['$props']>({
  component: markRaw(VBottomSheet),
  slots: { default: '123' },
})

onMounted(() => {
  modal.open()
})

const show = ref(false)
</script>

<template>
  <div>
    <button @click="show = !show">
      toggle
    </button>
    <VueFinalModal v-model="show">
      123
    </VueFinalModal>
    <ModalsContainer />
  </div>
</template>
