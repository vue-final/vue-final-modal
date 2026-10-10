<script setup lang="ts">
import type { VueFinalModalEmits } from '../index'
import { VueFinalModal, useVfmAttrs, vueFinalModalProps } from '../index'

defineOptions({ inheritAttrs: false })

const props = defineProps(vueFinalModalProps)
const emit = defineEmits<VueFinalModalEmits>()
const vfmAttrs = useVfmAttrs({ props, modalProps: vueFinalModalProps, emit })
</script>

<template>
  <VueFinalModal v-bind="vfmAttrs">
    <slot />
  </VueFinalModal>
</template>
