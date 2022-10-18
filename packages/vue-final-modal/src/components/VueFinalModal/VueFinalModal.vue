<script lang="ts">
import { computed, useAttrs } from 'vue'
import CoreModal from '../CoreModal/CoreModal.vue'
import { byPassAllModalEvents } from '../CoreModal/modalEvents'
import { coreModalProps } from '../CoreModal/CoreModalProps'
import { vueFinalModalProps } from './VueFinalModalProps'
import { pickModalProps } from '~/utils'

export default {
  inheritAttrs: false,
}
</script>

<script setup lang="ts">
const props = defineProps(vueFinalModalProps)

const emit = defineEmits<{
  (e: 'beforeOpen'): void
  (e: 'opened'): void
  (e: 'beforeClose'): void
  (e: 'closed'): void
  (e: 'update:modelValue', modelValue: boolean): void

  /** onClickOutside will only be emitted when clickToClose equal to `false` */
  (e: 'clickOutside'): void
}>()

const bindProps = computed(() => pickModalProps(props, coreModalProps))
const bindEmits = byPassAllModalEvents(emit)
const attrs = useAttrs()
</script>

<template>
  <Teleport :to="teleportTo ? teleportTo : undefined" :disabled="!teleportTo">
    <CoreModal v-bind="{ ...bindProps, ...bindEmits, ...attrs }">
      <slot />
    </CoreModal>
  </Teleport>
</template>
