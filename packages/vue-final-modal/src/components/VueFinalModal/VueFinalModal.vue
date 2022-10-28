<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import type { CoreModalEmits } from '../CoreModal/CoreModal.vue'
import CoreModal from '../CoreModal/CoreModal.vue'
import { coreModalProps } from '../CoreModal/CoreModalProps'
import { vueFinalModalProps } from './VueFinalModalProps'
import { byPassAllModalEvents, pickModalProps } from '~/utils'

export interface VueFinalModalEmits extends CoreModalEmits {}

defineOptions({
  inheritAttrs: false,
})

// eslint-disable-next-line vue/define-macros-order
const props = defineProps(vueFinalModalProps)
const emit = defineEmits<VueFinalModalEmits>()

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
