<script setup lang="ts">
import { useAttrs } from 'vue'
import CoreModal from '../CoreModal/CoreModal.vue'
import { useEmits } from './VueFinalModalEmits'
import { vueFinalModalProps } from './VueFinalModalProps'

const props = defineProps(vueFinalModalProps)

const emit = defineEmits<{
  /** Public events */
  (e: 'beforeClose'): void
  (e: 'closed'): void
  (e: 'beforeOpen'): void
  (e: 'opened'): void
  (e: 'update:modelValue', modelValue: boolean): void
  (e: 'clickOutside'): void

  /** Private events only be used for ModalsContainer */
  (e: 'internalBeforeClose'): void
  (e: 'internalClosed'): void
  (e: 'internalBeforeOpen'): void
  (e: 'internalOpened'): void
}>()

const attrs = useAttrs()

const bindEmits = useEmits(emit)
</script>

<template>
  <Teleport :to="teleportTo ? teleportTo : undefined" :disabled="!teleportTo">
    <CoreModal v-bind="{ ...props, ...attrs, ...bindEmits }">
      <slot />
    </CoreModal>
  </Teleport>
</template>
