<template>
  <vue-final-modal
    :transition="{
      'enter-active-class': 'slideInDown',
      'leave-active-class': 'slideOutDown'
    }"
  >
    <div
      ref="bottomSheetEl"
      class="vfm-bottom-sheet"
      :class="{ 'vfm-transition': !isSwiping }"
      :style="{ transform: `translateY(${-offsetY}px)` }"
    >
      <slot></slot>
    </div>
  </vue-final-modal>
</template>

<script>
import { ref, watch } from 'vue'
import { useSwipe } from '@vueuse/core'
import { VueFinalModal } from '../index'

function clamp(val, min, max) {
  return val > max ? max : val < min ? min : val
}

const LIMIT_DISTANCE = 0.1
const LIMIT_SPEED = 300
const DIRECTION_TO_CLOSE = 'DOWN'

export default {
  components: {
    VueFinalModal
  },
  setup(props, { emit, attrs }) {
    const bottomSheetEl = ref(null)
    const offsetY = ref(0)
    let swipeStart = null
    let allowSwipe = false

    const { lengthY, direction, isSwiping } = useSwipe(bottomSheetEl, {
      threshold: 0,
      onSwipeStart(e) {
        swipeStart = new Date().getTime()
        allowSwipe = canSwipe(e.target)
      },
      onSwipe() {
        if (!allowSwipe) return
        if (direction.value === DIRECTION_TO_CLOSE) {
          offsetY.value = -clamp(Math.abs(lengthY.value), 0, bottomSheetEl.value.offsetHeight)
        }
      },
      onSwipeEnd(event, direction) {
        const swipeEnd = new Date().getTime()

        const validDirection = direction === DIRECTION_TO_CLOSE
        const validDistance = Math.abs(lengthY.value) > LIMIT_DISTANCE * bottomSheetEl.value.offsetHeight
        const validSpeed = swipeEnd - swipeStart <= LIMIT_SPEED

        if (allowSwipe && validDirection && (validDistance || validSpeed)) {
          // eslint-disable-next-line vue/require-explicit-emits
          emit('update:modelValue', false)
          return
        }

        offsetY.value = 0
      }
    })

    watch(
      () => attrs.modelValue,
      val => {
        if (val) {
          offsetY.value = 0
        }
      }
    )

    function canSwipe(target) {
      const allow = target.scrollTop === 0
      if (target === bottomSheetEl.value) {
        return allow
      } else {
        return allow && canSwipe(target.parentElement)
      }
    }

    return {
      bottomSheetEl,
      offsetY,
      isSwiping
    }
  }
}
</script>

<style scoped>
.vfm-bottom-sheet {
  position: absolute;
  bottom: 0;
  width: 100%;
  max-height: 90%;
  overflow-y: auto;
  background-color: #fff;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.vfm-transition {
  transition-property: transform;
  transition-duration: 150ms;
}

@keyframes slideInDown {
  from {
    transform: translate3d(0, 100%, 0);
  }

  to {
    transform: translate3d(0, 0, 0);
  }
}

:deep(.slideInDown) {
  animation-name: slideInDown;
  animation-duration: 0.3s;
}

@keyframes slideOutDown {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(0, 100%, 0);
  }
}

:deep(.slideOutDown) {
  animation-name: slideOutDown;
  animation-duration: 0.3s;
}
</style>
