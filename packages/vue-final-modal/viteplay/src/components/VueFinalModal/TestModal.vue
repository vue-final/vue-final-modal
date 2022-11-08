<script lang="ts" setup>
import type { PropType } from 'vue'
import type { VueFinalModalEmits } from 'vue-final-modal'
import {
  VueFinalModal,
  useVfmAttrs,
  vueFinalModalProps,
} from 'vue-final-modal'

export interface TestModalEmits extends VueFinalModalEmits {
}

defineOptions({
  inheritAttrs: false,
})

// eslint-disable-next-line vue/define-macros-order
const props = defineProps({
  customPropA: { type: Boolean as PropType<boolean>, default: false },
  customPropB: { type: Boolean as PropType<boolean>, default: false },
  ...vueFinalModalProps,
})

const emit = defineEmits<TestModalEmits>()

const vfmAttrs = useVfmAttrs({
  props,
  modalProps: vueFinalModalProps,
  emit,
})
</script>

<template>
  <VueFinalModal v-bind="vfmAttrs">
    <slot />
  </VueFinalModal>
</template>
