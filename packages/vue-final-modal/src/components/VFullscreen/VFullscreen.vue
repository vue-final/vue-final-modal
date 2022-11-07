<script setup lang="ts">
import type { TransitionProps } from 'vue'
import { computed, ref, watch } from 'vue'
import type { VueFinalModalEmits } from '../VueFinalModal/VueFinalModal.vue'
import VueFinalModal from '../VueFinalModal/VueFinalModal.vue'
import { vueFinalModalProps } from '../VueFinalModal/VueFinalModalProps'
import { vFullscreenProps } from './VFullscreenProps'
import { useSwipeToClose } from '~/useSwipeToClose'
import { useVfmAttrs } from '~/useApi'

export interface VFullscreenEmits extends VueFinalModalEmits {}

defineOptions({
  inheritAttrs: false,
})

// eslint-disable-next-line vue/define-macros-order
const props = defineProps(vFullscreenProps)
const emit = defineEmits<VFullscreenEmits>()

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

const vfmFullscreenContentEl = ref<HTMLDivElement>()
const swipeBannerEl = ref()
const swipeEl = computed(() => (props.showSwipeBanner ? swipeBannerEl.value : vfmFullscreenContentEl.value))

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
</script>

<template>
  <VueFinalModal
    v-bind="{
      ...vfmAttrs,
      contentTransition,
    }"
    class="vfm-fullscreen"
  >
    <div
      ref="vfmFullscreenContentEl"
      class="vfm-fullscreen-content"
      :class="[{ 'vfm-bounce-back': !isSwiping }, fullscreenClass]"
      :style="[{ transform: `translateX(${-offset}px)` }, fullscreenStyle || {}]"
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
    </div>
  </VueFinalModal>
</template>

<style lang="scss">
.vfm-fullscreen {
  .vfm__content {
    width: 100%;
    height: 100%;
  }
  .vfm-fullscreen-content {
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
    transition-duration: 0.3s;
  }

  .vfm-slide-right-enter-active,
  .vfm-slide-right-leave-active {
    transition: transform .3s ease;
  }
  .vfm-slide-right-enter-from,
  .vfm-slide-right-leave-to {
    transform: translateX(100%);
  }

  .vfm-slide-left-enter-active,
  .vfm-slide-left-leave-active {
    transition: transform .3s ease;
  }
  .vfm-slide-left-enter-from,
  .vfm-slide-left-leave-to {
    transform: translateX(-100%);
  }
}
</style>
