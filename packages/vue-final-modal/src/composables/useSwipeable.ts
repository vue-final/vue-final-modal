import type { Ref } from 'vue'
import { computed, reactive, ref } from 'vue'
import { useEventListener } from '@vueuse/core'

export type SwiperDirection = 'up' | 'right' | 'down' | 'left' | 'none'

export function useSwipeable(
  el: Ref<undefined | HTMLElement>,
  {
    threshold = 0,
    onSwipeStart,
    onSwipe,
    onSwipeEnd,
  }: {
    threshold?: number
    onSwipeStart?: (e: MouseEvent | TouchEvent) => void
    onSwipe?: (e: MouseEvent | TouchEvent) => void
    onSwipeEnd?: (e: MouseEvent | TouchEvent, direction: SwiperDirection) => void
  },
) {
  const coordsStart = reactive({ x: 0, y: 0 })
  const coordsEnd = reactive({ x: 0, y: 0 })

  const lengthX = computed(() => coordsStart.x - coordsEnd.x)
  const lengthY = computed(() => coordsStart.y - coordsEnd.y)

  const { max, abs } = Math
  const isThresholdExceeded = computed(() => max(abs(lengthX.value), abs(lengthY.value)) >= threshold)
  const isSwiping = ref(false)

  const direction = computed<SwiperDirection>(() => {
    if (!isThresholdExceeded.value)
      return 'none'
    if (abs(lengthX.value) > abs(lengthY.value))
      return lengthX.value > 0 ? 'left' : 'right'
    return lengthY.value > 0 ? 'up' : 'down'
  })

  const listenerOptions = { passive: true }
  let stopMoveListeners: (() => void)[] = []

  function pointerStart(e: MouseEvent | TouchEvent) {
    const { x, y } = getPosition(e)
    Object.assign(coordsStart, { x, y })
    Object.assign(coordsEnd, { x, y })
    onSwipeStart?.(e)

    stopMoveListeners = [
      useEventListener(el, 'mousemove', pointerMove, listenerOptions),
      useEventListener(el, 'touchmove', pointerMove, listenerOptions),
      useEventListener(el, 'mouseup', pointerEnd, listenerOptions),
      useEventListener(el, 'touchend', pointerEnd, listenerOptions),
      useEventListener(el, 'touchcancel', pointerEnd, listenerOptions),
    ]
  }

  function pointerMove(e: MouseEvent | TouchEvent) {
    Object.assign(coordsEnd, getPosition(e))
    if (isThresholdExceeded.value)
      isSwiping.value = true
    if (isSwiping.value)
      onSwipe?.(e)
  }

  function pointerEnd(e: MouseEvent | TouchEvent) {
    if (isSwiping.value)
      onSwipeEnd?.(e, direction.value)
    isSwiping.value = false
    stopMoveListeners.forEach(stop => stop())
  }

  useEventListener(el, 'mousedown', pointerStart, listenerOptions)
  useEventListener(el, 'touchstart', pointerStart, listenerOptions)

  return {
    isSwiping,
    direction,
    lengthX,
    lengthY,
  }
}

function getPosition(e: TouchEvent | MouseEvent) {
  const { clientX: x, clientY: y } = e instanceof MouseEvent ? e : e.targetTouches[0]
  return { x, y }
}
