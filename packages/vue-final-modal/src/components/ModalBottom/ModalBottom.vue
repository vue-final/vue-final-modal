<script setup lang="ts">
import type { TransitionProps } from 'vue'
import { computed, ref, watch } from 'vue'
import type { VueFinalModalEmits } from '../VueFinalModal/VueFinalModal.vue'
import VueFinalModal from '../VueFinalModal/VueFinalModal.vue'
import { vueFinalModalProps } from '../VueFinalModal/VueFinalModalProps'
import { modalBottomProps } from './ModalBottomProps'
import { useSwipeToClose } from '~/useSwipeToClose'
import { useVfmAttrs } from '~/useApi'

export interface ModalBottomEmits extends VueFinalModalEmits {}

const props = defineProps(modalBottomProps)

const emit = defineEmits<ModalBottomEmits>()

defineOptions({
  inheritAttrs: false,
})

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

const VueFinalModalComp = ref<InstanceType<typeof VueFinalModal>>()
const vfmContentEl = computed(() => VueFinalModalComp.value?.vfmContentEl)

defineExpose({
  vfmContentEl,
})

const { offset, isSwiping } = useSwipeToClose(vfmContentEl, {
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

const bindContent = computed(() => {
  if (props.closeDirection === 'NONE')
    return {}
  return {
    class: { 'vfm-bounce-back': !isSwiping.value },
    style: isSwiping.value ? { transform: `translateY(${-offset.value}px)` } : '',
  }
})
</script>

<template>
  <VueFinalModal
    ref="VueFinalModalComp"
    v-bind="{
      ...vfmAttrs,
      contentTransition,
      bindContent,
    }"
    class="vfm-bottom-sheet"
  >
    <slot />
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
