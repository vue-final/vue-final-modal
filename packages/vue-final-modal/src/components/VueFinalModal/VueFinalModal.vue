<script lang="ts">
import { computed, useAttrs } from 'vue'
import CoreModal from '../CoreModal/CoreModal.vue'
import { useEmits } from '../CoreModal/CoreModalEmits'
import { coreModalProps } from '../CoreModal/CoreModalProps'
import { vueFinalModalProps } from './VueFinalModalProps'
export default {
  inheritAttrs: false,
}
</script>

<script setup lang="ts">
const props = defineProps({ ...vueFinalModalProps, ...coreModalProps })

const emit = defineEmits<{
  /** Public events */
  (e: 'beforeClose'): void
  (e: 'closed'): void
  (e: 'beforeOpen'): void
  (e: 'opened'): void
  (e: 'update:modelValue', modelValue: boolean): void

  /** onClickOutside will only be emitted when clickToClose equal to `false` */
  (e: 'clickOutside'): void

  /** Private events only be used for ModalsContainer */
  (e: 'internalBeforeClose'): void
  (e: 'internalClosed'): void
  (e: 'internalBeforeOpen'): void
  (e: 'internalOpened'): void
}>()

const bindProps = computed(() => {
  const _props: any = { ...props }
  const keys = Object.keys(vueFinalModalProps)
  keys.forEach((key) => {
    delete _props[key]
  })
  return _props
})

const bindEmits = useEmits(emit)
const attrs = useAttrs()
</script>

<template>
  <Teleport :to="teleportTo ? teleportTo : undefined" :disabled="!teleportTo">
    <CoreModal v-bind="{ ...bindProps, ...bindEmits, ...attrs }">
      <slot />
    </CoreModal>
  </Teleport>
</template>
