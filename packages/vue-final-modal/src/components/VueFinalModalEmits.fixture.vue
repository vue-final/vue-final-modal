<script setup lang="ts">
import type { VueFinalModalEmits } from '../index'
import { VueFinalModal, useVfmAttrs, vueFinalModalProps } from '../index'

const props = defineProps(vueFinalModalProps)
const emit = defineEmits<VueFinalModalEmits>()
defineOptions({ inheritAttrs: false })

const vfmAttrs = useVfmAttrs({ props, modalProps: vueFinalModalProps, emit })
</script>

<template>
  <VueFinalModal v-bind="vfmAttrs">
    <slot />
  </VueFinalModal>
</template>
