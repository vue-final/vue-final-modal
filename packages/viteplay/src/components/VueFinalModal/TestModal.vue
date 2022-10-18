<script lang="ts">
import type { PropType } from 'vue'
import { computed, useAttrs } from 'vue'
import { VueFinalModal, byPassAllModalEvents, pickModalProps, vueFinalModalProps } from 'vue-final-modal'

export default { inheritAttrs: false }
</script>

<script lang="ts" setup>
const props = defineProps({
  customPropA: { type: Boolean as PropType<boolean>, default: false },
  customPropB: { type: Boolean as PropType<boolean>, default: false },
  ...vueFinalModalProps,
})

const emit = defineEmits<{
  (e: 'beforeOpen'): void
  (e: 'opened'): void
  (e: 'beforeClose'): void
  (e: 'closed'): void
  (e: 'update:modelValue', modelValue: boolean): void

  /** onClickOutside will only be emitted when clickToClose equal to `false` */
  (e: 'clickOutside'): void
}>()

const bindProps = computed(() => pickModalProps(props, vueFinalModalProps))
const bindEmits = byPassAllModalEvents(emit)
const attrs = useAttrs()
</script>

<template>
  <VueFinalModal v-bind="{ ...bindProps, ...bindEmits, ...attrs }">
    <slot />
  </VueFinalModal>
</template>
