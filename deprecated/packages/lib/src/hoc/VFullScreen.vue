<template>
  <vue-final-modal
    v-bind="attrs"
    class="vfm-full-screen"
    :hide-overlay="hideOverlay"
    :transition="transition"
    :content-style="[{ transform: `translateX(${-offsetX}px)` }]"
    :content-class="{ 'vfm-transition': !isSwiping }"
    :lock-scroll="lockScroll"
    @closed="looseFocus"
  >
    <div ref="modalContent" class="vfm-full-screen-content" :class="fullScreenClass" :style="fullScreenStyle">
      <slot></slot>
      <div
        v-if="showSwipeBanner"
        ref="swipeBannerContainerEl"
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
  </vue-final-modal>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>

<script setup>
import { computed, ref, useAttrs, watch } from 'vue'
import { useEventListener } from '@vueuse/core'
import { useSwipeable } from '../utils/swipeable'
import { VueFinalModal } from '../modalInstance'
import { looseFocus } from '../utils/dom'
import { noop } from '../utils'

function clamp(val, min, max) {
  return val > max ? max : val < min ? min : val
}

const LIMIT_DISTANCE = 0.1
const LIMIT_SPEED = 300

const props = defineProps({
  fullScreenClass: { type: [String, Object, Array], default: '' },
  fullScreenStyle: { type: [Object, Array], default: () => ({}) },
  transition: { type: [String, Object], default: 'vfm' },
  canSwipeToClose: { type: Boolean, default: false },
  closeDirection: {
    type: String,
    default: '',
    validator(val) {
      return ['', 'RIGHT', 'LEFT'].includes(val) !== -1
    }
  },
  threshold: { type: Number, default: 30 },
  lockScroll: { type: Boolean, default: false },
  hideOverlay: { type: Boolean, default: true },
  showSwipeBanner: { type: Boolean, default: false },
  preventNavigationGestures: { type: Boolean, default: undefined }
})

const attrs = useAttrs()
const emit = defineEmits()

const modalContent = ref(null)
const swipeBannerContainerEl = ref()
const swipeEl = computed(() => (props.showSwipeBanner ? swipeBannerContainerEl.value : modalContent.value))

const offsetX = ref(0)
const isCollapsed = ref(true)
let stopSelectionChange = noop
let shouldCloseModal = true
let swipeStart = null
let allowSwipe = false

const transition = computed(() => {
  if (props.closeDirection) {
    return {
      'enter-active-class': props.closeDirection === 'RIGHT' ? 'vfmSlideInRight' : 'vfmSlideInLeft',
      'leave-active-class': props.closeDirection === 'RIGHT' ? 'vfmSlideOutRight' : 'vfmSlideOutLeft'
    }
  } else {
    return props.transition
  }
})

const { lengthX, direction, isSwiping } = props.canSwipeToClose
  ? useSwipeable(swipeEl, {
      threshold: props.threshold,
      onSwipeStart(e) {
        stopSelectionChange = useEventListener(document, 'selectionchange', () => {
          isCollapsed.value = window.getSelection().isCollapsed
        })
        swipeStart = new Date().getTime()
        allowSwipe = canSwipe(e.target)
      },
      onSwipe() {
        if (!allowSwipe) return
        if (direction.value === props.closeDirection) {
          if (!isCollapsed.value) return
          const _offsetX = clamp(Math.abs(lengthX.value), 0, modalContent.value.offsetWidth) - props.threshold
          offsetX.value = props.closeDirection === 'RIGHT' ? -_offsetX : _offsetX
        }
      },
      onSwipeEnd(event, direction) {
        stopSelectionChange()
        if (!isCollapsed.value) {
          isCollapsed.value = true
          return
        }

        const swipeEnd = new Date().getTime()

        const validDirection = direction === props.closeDirection
        const validDistance = Math.abs(lengthX.value) > LIMIT_DISTANCE * modalContent.value.offsetWidth
        const validSpeed = swipeEnd - swipeStart <= LIMIT_SPEED

        if (shouldCloseModal && allowSwipe && validDirection && (validDistance || validSpeed)) {
          // eslint-disable-next-line vue/require-explicit-emits
          emit('update:modelValue', false)
          return
        }

        offsetX.value = 0
      }
    })
  : {}

watch(
  () => attrs.modelValue,
  val => {
    if (val) {
      offsetX.value = 0
    }
  }
)

watch(
  () => isCollapsed.value,
  val => {
    if (!val) {
      offsetX.value = 0
    }
  }
)

watch(
  () => offsetX.value,
  (newValue, oldValue) => {
    if (!props.canSwipeToClose) return
    if (props.closeDirection === 'RIGHT') {
      shouldCloseModal = newValue < oldValue
    } else if (props.closeDirection === 'LEFT') {
      shouldCloseModal = newValue > oldValue
    }
  }
)

function canSwipe(target) {
  const tagName = target?.tagName
  if (!tagName || ['INPUT', 'TEXTAREA'].includes(tagName)) return false

  const allow = target?.scrollLeft === 0
  if (target === swipeEl.value) {
    return allow
  } else {
    return allow && canSwipe(target.parentElement)
  }
}

function onTouchStartSwipeBanner(e) {
  if (props.preventNavigationGestures) {
    e.preventDefault()
  }
}
</script>

<style lang="scss">
.vfm-full-screen {
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

  .vfm-transition {
    transition-property: transform;
    transition-duration: 0.3s;
  }

  .vfm__content {
    width: 100%;
    height: 100%;
  }

  @keyframes vfmSlideInLeft {
    from {
      transform: translate3d(-100%, 0, 0);
    }

    to {
      transform: translate3d(0, 0, 0);
    }
  }

  .vfmSlideInLeft {
    animation-name: vfmSlideInLeft;
    animation-duration: 0.3s;
  }

  @keyframes vfmSlideInRight {
    from {
      transform: translate3d(100%, 0, 0);
    }

    to {
      transform: translate3d(0, 0, 0);
    }
  }

  .vfmSlideInRight {
    animation-name: vfmSlideInRight;
    animation-duration: 0.3s;
  }

  @keyframes vfmSlideOutLeft {
    from {
      transform: translate3d(0, 0, 0);
    }

    to {
      transform: translate3d(-100%, 0, 0);
    }
  }

  .vfmSlideOutLeft {
    animation-name: vfmSlideOutLeft;
    animation-duration: 0.3s;
  }

  @keyframes vfmSlideOutRight {
    from {
      transform: translate3d(0, 0, 0);
    }

    to {
      transform: translate3d(100%, 0, 0);
    }
  }

  .vfmSlideOutRight {
    animation-name: vfmSlideOutRight;
    animation-duration: 0.3s;
  }
}
</style>
