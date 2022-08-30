import { computed, reactive, ref } from 'vue'
import { getPosition, checkPassiveEventSupport } from './dom'
import { useEventListener } from '@vueuse/core'

const SwipeDirection = {
  UP: 'UP',
  RIGHT: 'RIGHT',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  NONE: 'NONE'
}

export function useSwipeable(el, { threshold = 50, onSwipeStart, onSwipe, onSwipeEnd, passive = true }) {
  const coordsStart = reactive({ x: 0, y: 0 })
  const coordsEnd = reactive({ x: 0, y: 0 })

  const diffX = computed(() => coordsStart.x - coordsEnd.x)
  const diffY = computed(() => coordsStart.y - coordsEnd.y)

  const { max, abs } = Math
  const isThresholdExceeded = computed(() => max(abs(diffX.value), abs(diffY.value)) >= threshold)
  const isSwiping = ref(false)

  const direction = computed(() => {
    if (!isThresholdExceeded.value) return SwipeDirection.NONE

    if (abs(diffX.value) > abs(diffY.value)) {
      return diffX.value > 0 ? SwipeDirection.LEFT : SwipeDirection.RIGHT
    } else {
      return diffY.value > 0 ? SwipeDirection.UP : SwipeDirection.DOWN
    }
  })

  const updateCoordsStart = (x, y) => {
    coordsStart.x = x
    coordsStart.y = y
  }

  const updateCoordsEnd = (x, y) => {
    coordsEnd.x = x
    coordsEnd.y = y
  }

  let listenerOptions

  const isPassiveEventSupported = checkPassiveEventSupport(window?.document)

  if (!passive) {
    listenerOptions = isPassiveEventSupported ? { passive: false, capture: true } : { capture: true }
  } else {
    listenerOptions = isPassiveEventSupported ? { passive: true } : { capture: false }
  }

  let events
  function pointerStart(e) {
    if (listenerOptions.capture && !listenerOptions.passive) {
      e.preventDefault()
    }
    const { x, y } = getPosition(e)
    updateCoordsStart(x, y)
    updateCoordsEnd(x, y)
    onSwipeStart?.(e)

    events = [
      useEventListener(el, 'mousemove', pointerMove, listenerOptions),
      useEventListener(el, 'touchmove', pointerMove, listenerOptions),
      useEventListener(el, 'mouseup', pointerEnd, listenerOptions),
      useEventListener(el, 'touchend', pointerEnd, listenerOptions),
      useEventListener(el, 'touchcancel', pointerEnd, listenerOptions)
    ]
  }

  function pointerMove(e) {
    const { x, y } = getPosition(e)
    updateCoordsEnd(x, y)
    if (!isSwiping.value && isThresholdExceeded.value) {
      isSwiping.value = true
    }
    if (isSwiping.value) {
      onSwipe?.(e)
    }
  }

  function pointerEnd(e) {
    if (isSwiping.value) {
      onSwipeEnd?.(e, direction.value)
    }

    isSwiping.value = false

    events.forEach(s => s())
  }

  const stops = [
    useEventListener(el, 'mousedown', pointerStart, listenerOptions),
    useEventListener(el, 'touchstart', pointerStart, listenerOptions)
  ]

  const stop = () => {
    stops.forEach(s => s())
    events.forEach(s => s())
  }

  return {
    isPassiveEventSupported,
    isSwiping,
    direction,
    coordsStart,
    coordsEnd,
    lengthX: diffX,
    lengthY: diffY,
    stop
  }
}
