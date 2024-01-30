<script lang="ts" setup>
import type { PropType } from 'vue'
// import type { VueFinalModalEmits } from 'vue-final-modal'
import {
  VueFinalModal,
  useVfmAttrs,
  vueFinalModalProps,
} from 'vue-final-modal'

// export interface TestModalEmits extends VueFinalModalEmits {
// }

const props = defineProps({
  ...vueFinalModalProps,
  customPropA: { type: Boolean as PropType<boolean>, default: false },
  customPropB: { type: Boolean as PropType<boolean>, default: false },
})

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: boolean): void
  (e: 'beforeOpen', event: { stop: () => void }): void
  (e: 'opened'): void
  (e: 'beforeClose', event: { stop: () => void }): void
  (e: 'closed'): void
  /** onClickOutside will only be emitted when clickToClose equal to `false` */
  (e: 'clickOutside'): void
}>()

const vfmAttrs = useVfmAttrs({
  props,
  modalProps: vueFinalModalProps,
  emit,
})
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <VueFinalModal v-bind="vfmAttrs">
    <slot />
  </VueFinalModal>
</template>
