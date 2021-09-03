<template>
  <vue-final-modal
    :transition="{
      'enter-active-class': 'transition duration-300 ease-in-out transform',
      'enter-from-class': 'translate-y-full',
      'enter-to-class': 'translate-y-0',
      'leave-active-class': 'transition duration-300 ease-in-out transform',
      'leave-to-class': 'translate-y-full',
      'leave-from-class': 'translate-y-0'
    }"
  >
    <div
      ref="modalContent"
      class="absolute bottom-0 w-full max-h-[90%] overflow-y-auto bg-white"
      :class="{ 'transition-transform': !isSwiping }"
      :style="{ transform: `translateY(${-offsetY}px)` }"
    >
      <slot></slot>
    </div>
  </vue-final-modal>
</template>

<script>
import { ref, watch } from 'vue'
import { useSwipe } from '@vueuse/core'

function clamp(val, min, max) {
  return val > max ? max : val < min ? min : val
}

const LIMIT_DISTANCE = 0.5
const LIMIT_SPEED = 300
const DIRECTION_TO_CLOSE = 'DOWN'

export default {
  setup(props, { emit, attrs }) {
    const modalContent = ref(null)
    const offsetY = ref(0)
    let swipeStart = null

    const { lengthY, direction, isSwiping } = useSwipe(modalContent, {
      threshold: 0,
      onSwipeStart() {
        swipeStart = new Date().getTime()
      },
      onSwipe() {
        if (direction.value === DIRECTION_TO_CLOSE) {
          offsetY.value = -clamp(Math.abs(lengthY.value), 0, modalContent.value.offsetHeight)
        }
      },
      onSwipeEnd(event, direction) {
        const swipeEnd = new Date().getTime()

        const validDirection = direction === DIRECTION_TO_CLOSE
        const validDistance = Math.abs(lengthY.value) > LIMIT_DISTANCE * modalContent.value.offsetHeight
        const validSpeed = swipeEnd - swipeStart <= LIMIT_SPEED

        if (validDirection && (validDistance || validSpeed)) {
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

    return {
      modalContent,
      offsetY,
      isSwiping
    }
  }
}
</script>
