<script setup lang="ts">
import type { TransitionProps } from 'vue'
import { computed, ref, watch } from 'vue'
import type { VueFinalModalEmits } from '../VueFinalModal/VueFinalModal.vue'
import VueFinalModal from '../VueFinalModal/VueFinalModal.vue'
import { vueFinalModalProps } from '../VueFinalModal/VueFinalModalProps'
import { vBottomSheetProps } from './VBottomSheetProps'
import { useSwipeToClose } from '~/useSwipeToClose'
import { useVfmAttrs } from '~/useApi'

export interface VBottomSheetEmits extends VueFinalModalEmits {}

defineOptions({
  inheritAttrs: false,
})

// eslint-disable-next-line vue/define-macros-order
const props = defineProps(vBottomSheetProps)
const emit = defineEmits<VBottomSheetEmits>()

const vfmAttrs = useVfmAttrs({
  props,
  modalProps: vueFinalModalProps,
  emit,
})

const contentTransition = computed<undefined | TransitionProps>(() => {
  if (props.closeDirection === 'DOWN')
    return { name: 'vfm-slide-down' }
  else
    return props.contentTransition
})

const vfmBottomSheetContentEl = ref<HTMLDivElement>()

const { offset, isSwiping } = useSwipeToClose(vfmBottomSheetContentEl, {
  direction: props.closeDirection,
  threshold: props.threshold,
  close: () => emit('update:modelValue', false),
})

watch(
  () => props.modelValue,
  (val) => {
    if (val)
      offset.value = 0
  },
)
</script>

<template>
  <VueFinalModal
    v-bind="{
      ...vfmAttrs,
      contentTransition,
    }"
    class="vfm-bottom-sheet"
  >
    <div
      ref="vfmBottomSheetContentEl"
      class="vfm-bottom-sheet-content"
      :class="[{ 'vfm-bounce-back': !isSwiping }, bottomSheetClass]"
      :style="[{ transform: `translateY(${-offset}px)` }, bottomSheetStyle || {}]"
    >
      <slot />
    </div>
  </VueFinalModal>
</template>

<style lang="scss">
.vfm-bottom-sheet {
  .vfm__content {
    position: absolute;
    bottom: 0;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-height: 90%;
  }
  .vfm-bottom-sheet-content {
    overflow-y: auto;
  }

  .vfm-bounce-back {
    transition-property: transform;
    transition-duration: .25s;
  }

  .vfm-slide-down-enter-active,
  .vfm-slide-down-leave-active {
    transition: transform .3s ease;
  }
  .vfm-slide-down-enter-from,
  .vfm-slide-down-leave-to {
    transform: translateY(100%);
  }
}
</style>
