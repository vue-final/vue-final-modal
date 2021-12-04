<template>
  <vue-final-modal
    v-bind="attrs"
    hide-overlay
    :transition="transition"
    :content-style="[{ transform: `translateX(${-offsetX}px)` }]"
    :content-class="{ 'vfm-transition': !isSwiping }"
    @mousedown.stop
    @touchstart.stop.passive
  >
    <slot name="prepend"></slot>
    <div ref="modalContent" class="vfm-full-screen" :class="fullScreenClass" :style="fullScreenStyle">
      <slot></slot>
    </div>
    <slot name="append"></slot>
  </vue-final-modal>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>

<script setup>
import { computed, ref, useAttrs, watch } from 'vue'
import { useSwipeable } from '../utils/swipeable'
import { VueFinalModal } from '../modalInstance'

function clamp(val, min, max) {
  return val > max ? max : val < min ? min : val
}

const LIMIT_DISTANCE = 0.1
const LIMIT_SPEED = 300

const props = defineProps({
  fullScreenClass: { type: [String, Object, Array], default: '' },
  fullScreenStyle: { type: [Object, Array], default: () => ({}) },
  swipeToCloseDirection: {
    type: String,
    default: '',
    validator(val) {
      return ['', 'RIGHT', 'LEFT'].includes(val) !== -1
    }
  }
})

const attrs = useAttrs()
const emit = defineEmits()

const modalContent = ref(null)
const offsetX = ref(0)
let swipeStart = null
let allowSwipe = false

const transition = computed(() => {
  if (props.swipeToCloseDirection) {
    return {
      'enter-active-class': props.swipeToCloseDirection === 'RIGHT' ? 'slideInRight' : 'slideInLeft',
      'leave-active-class': props.swipeToCloseDirection === 'RIGHT' ? 'slideOutRight' : 'slideOutLeft'
    }
  } else {
    return {}
  }
})

const { lengthX, direction, isSwiping } = props.swipeToCloseDirection
  ? useSwipeable(modalContent, {
      threshold: 0,
      onSwipeStart(e) {
        swipeStart = new Date().getTime()
        allowSwipe = canSwipe(e.target)
        if (document.activeElement) {
          document.activeElement.blur()
        }
      },
      onSwipe() {
        if (!allowSwipe) return
        if (direction.value === props.swipeToCloseDirection) {
          const _offsetX = clamp(Math.abs(lengthX.value), 0, modalContent.value.offsetWidth)
          offsetX.value = props.swipeToCloseDirection === 'RIGHT' ? -_offsetX : _offsetX
        }
      },
      onSwipeEnd(event, direction) {
        const swipeEnd = new Date().getTime()

        const validDirection = direction === props.swipeToCloseDirection
        const validDistance = Math.abs(lengthX.value) > LIMIT_DISTANCE * modalContent.value.offsetWidth
        const validSpeed = swipeEnd - swipeStart <= LIMIT_SPEED

        if (allowSwipe && validDirection && (validDistance || validSpeed)) {
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

function canSwipe(target) {
  const allow = target.scrollLeft === 0
  if (target === modalContent.value) {
    return allow
  } else {
    return allow && canSwipe(target.parentElement)
  }
}
</script>

<style scoped>
.vfm-full-screen {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: #fff;
}

:deep(.vfm-transition) {
  transition-property: transform;
  transition-duration: 0.3s;
}

:deep(.vfm__content) {
  width: 100%;
  height: 100%;
}

@keyframes slideInLeft {
  from {
    transform: translate3d(-100%, 0, 0);
  }

  to {
    transform: translate3d(0, 0, 0);
  }
}

:deep(.slideInLeft) {
  animation-name: slideInLeft;
  animation-duration: 0.3s;
}

@keyframes slideInRight {
  from {
    transform: translate3d(100%, 0, 0);
  }

  to {
    transform: translate3d(0, 0, 0);
  }
}

:deep(.slideInRight) {
  animation-name: slideInRight;
  animation-duration: 0.3s;
}

@keyframes slideOutLeft {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(-100%, 0, 0);
  }
}

:deep(.slideOutLeft) {
  animation-name: slideOutLeft;
  animation-duration: 0.3s;
}

@keyframes slideOutRight {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(100%, 0, 0);
  }
}

:deep(.slideOutRight) {
  animation-name: slideOutRight;
  animation-duration: 0.3s;
}
</style>
