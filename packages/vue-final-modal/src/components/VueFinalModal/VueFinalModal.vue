<script setup lang="ts">
import { computed, ref } from 'vue'
import type { CoreModalEmits } from '../CoreModal/CoreModal.vue'
import CoreModal from '../CoreModal/CoreModal.vue'
import { coreModalProps } from '../CoreModal/CoreModalProps'
import { vueFinalModalProps } from './VueFinalModalProps'
import { useVfmAttrs } from '~/useApi'

export interface VueFinalModalEmits extends CoreModalEmits {}

defineOptions({
  inheritAttrs: false,
})

// eslint-disable-next-line vue/define-macros-order
const props = defineProps(vueFinalModalProps)
const emit = defineEmits<VueFinalModalEmits>()

const vfmAttrs = useVfmAttrs({
  props,
  modalProps: coreModalProps,
  emit,
})

const CoreModalComp = ref<InstanceType<typeof CoreModal>>()
const vfmContentEl = computed(() => CoreModalComp.value?.vfmContentEl)

defineExpose({
  vfmContentEl,
})
</script>

<template>
  <Teleport :to="teleportTo ? teleportTo : undefined" :disabled="!teleportTo">
    <CoreModal ref="CoreModalComp" v-bind="vfmAttrs">
      <slot />
    </CoreModal>
  </Teleport>
</template>
