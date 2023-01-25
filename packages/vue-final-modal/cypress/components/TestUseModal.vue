<script lang="ts" setup>
import { ModalsContainer, VueFinalModal, useModal } from '~/index'

useModal({
  defaultModelValue: true,
  component: VueFinalModal,
  slots: {
    default: 'Hello World!',
  },
})
</script>

<template>
  <ModalsContainer />
</template>
