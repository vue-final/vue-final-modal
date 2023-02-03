<script setup lang="ts">
import type { CoreModalEmits } from '../CoreModal/CoreModal.vue'
import CoreModal from '../CoreModal/CoreModal.vue'
import { coreModalProps } from '../CoreModal/CoreModalProps'
import { vueFinalModalProps } from './VueFinalModalProps'
import { useVfmAttrs } from '~/useApi'

export interface VueFinalModalEmits extends CoreModalEmits {}

const props = defineProps(vueFinalModalProps)

const emit = defineEmits<VueFinalModalEmits>()

defineOptions({
  inheritAttrs: false,
})

const vfmAttrs = useVfmAttrs({
  props,
  modalProps: coreModalProps,
  emit,
})
</script>

<template>
  <Teleport :to="teleportTo ? teleportTo : undefined" :disabled="!teleportTo">
    <CoreModal v-bind="vfmAttrs">
      <slot />
    </CoreModal>
  </Teleport>
</template>
