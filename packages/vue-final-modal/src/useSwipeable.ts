import type { Ref } from 'vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { useEventListener } from '@vueuse/core'
import { checkPassiveEventSupport, getPosition } from './dom'

export type SwiperDirection = 'up' | 'right' | 'down' | 'left' | 'none'

export function useSwipeable(
  el: Ref<undefined | HTMLElement>,
  {
    threshold = 0,
    onSwipeStart,
    onSwipe,
    onSwipeEnd,
    passive = true,
  }: {
    threshold?: number
    onSwipeStart?: (e?: MouseEvent | TouchEvent) => void
    onSwipe?: (e?: MouseEvent | TouchEvent) => void
    onSwipeEnd?: (e?: MouseEvent | TouchEvent, direction?: SwiperDirection) => void
    passive?: boolean
  },
) {
  const coordsStart = reactive({ x: 0, y: 0 })
  const coordsEnd = reactive({ x: 0, y: 0 })

  const diffX = computed(() => coordsStart.x - coordsEnd.x)
  const diffY = computed(() => coordsStart.y - coordsEnd.y)

  const { max, abs } = Math
  const isThresholdExceeded = computed(
    () => max(abs(diffX.value), abs(diffY.value)) >= threshold,
  )
  const isSwiping = ref(false)

  const direction = computed<SwiperDirection>(() => {
    if (!isThresholdExceeded.value)
      return 'none'

    if (abs(diffX.value) > abs(diffY.value))
      return diffX.value > 0 ? 'left' : 'right'

    else
      return diffY.value > 0 ? 'up' : 'down'
  })

  const updateCoordsStart = (x: number, y: number) => {
    coordsStart.x = x
    coordsStart.y = y
  }

  const updateCoordsEnd = (x: number, y: number) => {
    coordsEnd.x = x
    coordsEnd.y = y
  }

  let listenerOptions: { passive?: boolean; capture?: boolean }
  let events: (() => void)[]
  function pointerStart(e: MouseEvent | TouchEvent) {
    if (listenerOptions.capture && !listenerOptions.passive)
      e.preventDefault()

    const { x, y } = getPosition(e)
    updateCoordsStart(x, y)
    updateCoordsEnd(x, y)
    onSwipeStart?.(e)

    events = [
      useEventListener(el, 'mousemove', pointerMove, listenerOptions),
      useEventListener(el, 'touchmove', pointerMove, listenerOptions),
      useEventListener(el, 'mouseup', pointerEnd, listenerOptions),
      useEventListener(el, 'touchend', pointerEnd, listenerOptions),
      useEventListener(el, 'touchcancel', pointerEnd, listenerOptions),
    ]
  }

  function pointerMove(e: MouseEvent | TouchEvent) {
    const { x, y } = getPosition(e)
    updateCoordsEnd(x, y)
    if (!isSwiping.value && isThresholdExceeded.value)
      isSwiping.value = true

    if (isSwiping.value)
      onSwipe?.(e)
  }

  function pointerEnd(e: MouseEvent | TouchEvent) {
    if (isSwiping.value)
      onSwipeEnd?.(e, direction.value)

    isSwiping.value = false

    events.forEach(s => s())
  }

  let stops: (() => void)[] = []
  onMounted(() => {
    const isPassiveEventSupported = checkPassiveEventSupport(window?.document)

    if (!passive) {
      listenerOptions = isPassiveEventSupported
        ? { passive: false, capture: true }
        : { capture: true }
    }
    else {
      listenerOptions = isPassiveEventSupported
        ? { passive: true }
        : { capture: false }
    }

    stops = [
      useEventListener(el, 'mousedown', pointerStart, listenerOptions),
      useEventListener(el, 'touchstart', pointerStart, listenerOptions),
    ]
  })

  const stop = () => {
    stops.forEach(s => s())
    events.forEach(s => s())
  }

  return {
    isSwiping,
    direction,
    coordsStart,
    coordsEnd,
    lengthX: diffX,
    lengthY: diffY,
    stop,
  }
}
