<template>
  <vue-final-modal
    hide-overlay
    content-class="w-full h-full"
    :transition="{
      'enter-active-class': 'transition duration-300 ease-in-out transform',
      'enter-from-class': 'translate-x-full',
      'enter-to-class': 'translate-x-0',
      'leave-active-class': 'transition duration-300 ease-in-out transform',
      'leave-to-class': 'translate-x-full',
      'leave-from-class': 'translate-x-0'
    }"
  >
    <div
      ref="modalContent"
      class="w-full h-full bg-white"
      :class="{ 'transition-transform': !isSwiping }"
      :style="{ transform: `translateX(${-offsetX}px)` }"
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
const DIRECTION_TO_CLOSE = 'RIGHT'

export default {
  emits: ['update:modelValue'],
  setup(props, { emit, attrs }) {
    const modalContent = ref(null)
    const offsetX = ref(0)
    let swipeStart = null

    const { lengthX, direction, isSwiping } = useSwipe(modalContent, {
      threshold: 0,
      onSwipeStart() {
        swipeStart = new Date().getTime()
      },
      onSwipe() {
        if (direction.value === DIRECTION_TO_CLOSE) {
          offsetX.value = -clamp(Math.abs(lengthX.value), 0, modalContent.value.offsetWidth)
        }
      },
      onSwipeEnd(event, direction) {
        const swipeEnd = new Date().getTime()

        const validDirection = direction === DIRECTION_TO_CLOSE
        const validDistance = Math.abs(lengthX.value) > LIMIT_DISTANCE * modalContent.value.offsetWidth
        const validSpeed = swipeEnd - swipeStart <= LIMIT_SPEED

        if (validDirection && (validDistance || validSpeed)) {
          emit('update:modelValue', false)
          return
        }

        offsetX.value = 0
      }
    })

    watch(
      () => attrs.modelValue,
      val => {
        if (val) {
          offsetX.value = 0
        }
      }
    )

    return {
      modalContent,
      offsetX,
      isSwiping
    }
  }
}
</script>
