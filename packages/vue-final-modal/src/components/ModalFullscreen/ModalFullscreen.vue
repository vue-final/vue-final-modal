<script setup lang="ts">
import type { TransitionProps } from 'vue'
import { computed, ref, watch } from 'vue'
import type { VueFinalModalEmits } from '../VueFinalModal/VueFinalModal.vue'
import VueFinalModal from '../VueFinalModal/VueFinalModal.vue'
import { vueFinalModalProps } from '../VueFinalModal/VueFinalModalProps'
import { modalFullscreenProps } from './ModalFullscreenProps'
import { useSwipeToClose } from '~/useSwipeToClose'
import { useVfmAttrs } from '~/useApi'

export interface ModalFullscreenEmits extends VueFinalModalEmits {}

const props = defineProps(modalFullscreenProps)

const emit = defineEmits<ModalFullscreenEmits>()

defineOptions({
  inheritAttrs: false,
})

const vfmAttrs = useVfmAttrs({
  props,
  modalProps: vueFinalModalProps,
  emit,
})

const contentTransition = computed<undefined | TransitionProps>(() => {
  if (props.closeDirection === 'RIGHT')
    return { name: 'vfm-slide-right' }
  else if (props.closeDirection === 'LEFT')
    return { name: 'vfm-slide-left' }
  else
    return props.contentTransition
})

const VueFinalModalComp = ref<InstanceType<typeof VueFinalModal>>()
const vfmContentEl = computed(() => VueFinalModalComp.value?.vfmContentEl)

defineExpose({
  vfmContentEl,
})

const swipeBannerEl = ref()
const swipeEl = computed(() => (props.showSwipeBanner ? swipeBannerEl.value : vfmContentEl.value))

const { offset, isSwiping } = useSwipeToClose(swipeEl, {
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

function onTouchStartSwipeBanner(e: TouchEvent) {
  if (props.preventNavigationGestures)
    e.preventDefault()
}

const bindContent = computed(() => {
  if (props.closeDirection === 'NONE')
    return {}
  return {
    class: { 'vfm-bounce-back': !isSwiping.value },
    style: isSwiping.value ? { transform: `translateX(${-offset.value}px)` } : '',
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
    class="vfm-fullscreen"
  >
    <slot />
    <div
      v-if="showSwipeBanner"
      ref="swipeBannerEl"
      class="vfm-swipe-banner-container"
      @touchstart="e => onTouchStartSwipeBanner(e)"
    >
      <slot name="swipe-banner">
        <div class="vfm-swipe-banner-back" @touchstart="e => closeDirection === 'LEFT' && e.preventDefault()" />
        <div class="vfm-swipe-banner-forward" @touchstart="e => closeDirection === 'RIGHT' && e.preventDefault()" />
      </slot>
    </div>
    <div
      v-else-if="!showSwipeBanner && preventNavigationGestures"
      class="vfm-swipe-banner-container"
      @touchstart="e => onTouchStartSwipeBanner(e)"
    >
      <div class="vfm-swipe-banner-back" @touchstart="e => closeDirection === 'LEFT' && e.preventDefault()" />
      <div class="vfm-swipe-banner-forward" @touchstart="e => closeDirection === 'RIGHT' && e.preventDefault()" />
    </div>
  </VueFinalModal>
</template>

<style lang="scss">
.vfm-fullscreen {
  .vfm__content {
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }

  .vfm-swipe-banner-back,
  .vfm-swipe-banner-forward {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 27px;
    z-index: 10;
  }
  .vfm-swipe-banner-back {
    left: 0;
  }
  .vfm-swipe-banner-forward {
    right: 0;
  }

  .vfm-bounce-back {
    transition-property: transform;
    transition-duration: .3s;
  }

  .vfm-slide-right-enter-active,
  .vfm-slide-right-leave-active,
  .vfm-slide-left-enter-active,
  .vfm-slide-left-leave-active {
    transition: transform .3s ease;
  }
  .vfm-slide-right-enter-from,
  .vfm-slide-right-leave-to {
    transform: translateX(100%);
  }
  .vfm-slide-left-enter-from,
  .vfm-slide-left-leave-to {
    transform: translateX(-100%);
  }
  .vfm-swipe-banner-container {
    user-select: none;
  }
}
</style>
