<script setup lang="ts">
import type { TransitionProps } from 'vue'
import { computed, ref, useAttrs, watch } from 'vue'
import { useEventListener } from '@vueuse/core'
import VueFinalModal from '../VueFinalModal/VueFinalModal.vue'
import { useEmits } from '../CoreModal/CoreModalEmits'
import { vFullScreenModalProps } from './VFullScreenProps'
import { useSwipeable } from '~/useSwipeable'
import { clamp, noop } from '~/utils'

const props = defineProps(vFullScreenModalProps)

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

const bindEmits = useEmits(emit)

const LIMIT_DISTANCE = 0.1
const LIMIT_SPEED = 300

const attrs = useAttrs()
const contentEl = ref<HTMLDivElement>()
const swipeBannerEl = ref()
const swipeEl = computed(() => (props.showSwipeBanner ? swipeBannerEl.value : contentEl.value))
const offsetX = ref(0)
const isCollapsed = ref<boolean | undefined>(true)
let stopSelectionChange = noop
let shouldCloseModal = true
let swipeStart: number
let allowSwipe = false

const transition = computed<undefined | TransitionProps>(() => {
  if (props.closeDirection !== 'none') {
    if (props.closeDirection === 'RIGHT')
      return { name: 'vfm-slide-right' }
    else
      return { name: 'vfm-slide-left' }
  }
  else {
    return props.transition
  }
})

const { lengthX, direction, isSwiping } = props.closeDirection !== 'none'
  ? useSwipeable(swipeEl, {
    threshold: props.threshold,
    onSwipeStart(e) {
      stopSelectionChange = useEventListener(document, 'selectionchange', () => {
        isCollapsed.value = window.getSelection()?.isCollapsed
      })
      swipeStart = new Date().getTime()
      allowSwipe = canSwipe(e?.target)
    },
    onSwipe() {
      if (!allowSwipe)
        return
      if (direction?.value === props.closeDirection) {
        if (!isCollapsed.value)
          return
        const _offsetX = clamp(Math.abs(lengthX?.value || 0), 0, contentEl.value?.offsetWidth || 0) - props.threshold
        offsetX.value = props.closeDirection === 'RIGHT' ? -_offsetX : _offsetX
      }
    },
    onSwipeEnd(e, direction) {
      stopSelectionChange()
      if (!isCollapsed.value) {
        isCollapsed.value = true
        return
      }

      const swipeEnd = new Date().getTime()

      const validDirection = direction === props.closeDirection
      const validDistance = Math.abs(lengthX?.value || 0) > LIMIT_DISTANCE * (contentEl.value?.offsetWidth || 0)
      const validSpeed = swipeEnd - swipeStart <= LIMIT_SPEED

      if (shouldCloseModal && allowSwipe && validDirection && (validDistance || validSpeed)) {
        offsetX.value = 0
        emit('update:modelValue', false)
        return
      }

      offsetX.value = 0
    },
  })
  : {
      lengthX: undefined,
      direction: undefined,
      isSwiping: undefined,
    }

watch(
  () => attrs.modelValue,
  (val) => {
    if (val)
      offsetX.value = 0
  },
)

watch(
  () => isCollapsed.value,
  (val) => {
    if (!val)
      offsetX.value = 0
  },
)

watch(
  () => offsetX.value,
  (newValue, oldValue) => {
    if (props.closeDirection === 'none')
      return
    if (props.closeDirection === 'RIGHT')
      shouldCloseModal = newValue < oldValue
    else if (props.closeDirection === 'LEFT')
      shouldCloseModal = newValue > oldValue
  },
)

function canSwipe(target?: null | EventTarget): boolean {
  const tagName = (target as HTMLElement)?.tagName
  if (!tagName || ['INPUT', 'TEXTAREA'].includes(tagName))
    return false

  const allow = (target as HTMLElement)?.scrollLeft === 0
  if (target === swipeEl.value)
    return allow

  else
    return allow && canSwipe((target as HTMLElement).parentElement)
}

function onTouchStartSwipeBanner(e: TouchEvent) {
  if (props.preventNavigationGestures)
    e.preventDefault()
}
</script>

<template>
  <VueFinalModal
    v-bind="{
      ...props,
      ...attrs,
      transition,
      ...bindEmits,
    }"
    class="vfm-full-screen"
  >
    <div
      ref="contentEl"
      class="vfm-full-screen-content"
      :class="[{ 'vfm-bounce-back': !isSwiping }, fullScreenClass]"
      :style="[{ transform: `translateX(${-offsetX}px)` }, fullScreenStyle || {}]"
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
.vfm-full-screen {
  .vfm__content {
    width: 100%;
    height: 100%;
  }
  .vfm-full-screen-content {
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
