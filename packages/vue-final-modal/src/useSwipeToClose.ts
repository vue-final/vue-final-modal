import { useEventListener } from '@vueuse/core'
import type { Ref } from 'vue'
import { ref, watch } from 'vue'
import type { SwiperDirection } from './useSwipeable'
import { useSwipeable } from './useSwipeable'
import { clamp, noop } from './utils'

export function useSwipeToClose(
  el: Ref<undefined | HTMLElement>,
  options: {
    direction: SwiperDirection
    threshold: number
    close: () => void
  },
) {
  const { direction, threshold, close } = options
  const LIMIT_DISTANCE = 0.1
  const LIMIT_SPEED = 300
  const offset = ref(0)
  const isCollapsed = ref<boolean | undefined>(true)

  let stopSelectionChange = noop
  let shouldCloseModal = true
  let swipeStart: number
  let allowSwipe = false

  const { lengthX, lengthY, direction: _direction, isSwiping } = useSwipeable(el, {
    threshold,
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
      if (!isCollapsed.value)
        return
      if (_direction.value !== direction)
        return
      if (_direction.value === 'UP') {
        const offsetY = clamp(Math.abs(lengthY.value || 0), 0, el.value?.offsetHeight || 0) - threshold
        offset.value = offsetY
      }
      else if (_direction.value === 'DOWN') {
        const offsetY = clamp(Math.abs(lengthY.value || 0), 0, el.value?.offsetHeight || 0) - threshold
        offset.value = -offsetY
      }
      else if (_direction.value === 'RIGHT') {
        const offsetX = clamp(Math.abs(lengthX.value || 0), 0, el.value?.offsetWidth || 0) - threshold
        offset.value = -offsetX
      }
      else if (_direction.value === 'LEFT') {
        const offsetX = clamp(Math.abs(lengthX.value || 0), 0, el.value?.offsetWidth || 0) - threshold
        offset.value = offsetX
      }
    },
    onSwipeEnd(e, _direction) {
      stopSelectionChange()
      if (!isCollapsed.value) {
        isCollapsed.value = true
        return
      }

      const swipeEnd = new Date().getTime()

      const validDirection = _direction === direction
      const validDistance = (() => {
        if (_direction === 'UP' || _direction === 'DOWN')
          return Math.abs(lengthY?.value || 0) > LIMIT_DISTANCE * (el.value?.offsetHeight || 0)
        else if (_direction === 'LEFT' || _direction === 'RIGHT')
          return Math.abs(lengthX?.value || 0) > LIMIT_DISTANCE * (el.value?.offsetWidth || 0)
      })()
      const validSpeed = swipeEnd - swipeStart <= LIMIT_SPEED

      if (shouldCloseModal && allowSwipe && validDirection && (validDistance || validSpeed)) {
        offset.value = 0
        close()
        return
      }

      offset.value = 0
    },
  })

  watch(
    () => isCollapsed.value,
    (val) => {
      if (!val)
        offset.value = 0
    },
  )

  watch(
    () => offset.value,
    (newValue, oldValue) => {
      switch (direction) {
        case 'DOWN':
        case 'RIGHT':
          shouldCloseModal = newValue < oldValue
          break
        case 'UP':
        case 'LEFT':
          shouldCloseModal = newValue > oldValue
          break
      }
    },
  )

  function canSwipe(target?: null | EventTarget): boolean {
    const tagName = (target as HTMLElement)?.tagName
    if (!tagName || ['INPUT', 'TEXTAREA'].includes(tagName))
      return false

    const allow = (() => {
      if (direction === 'DOWN')
        return (target as HTMLElement)?.scrollTop === 0
      else if (direction === 'RIGHT')
        return (target as HTMLElement)?.scrollLeft === 0
      else
        return false
    })()

    if (target === el.value)
      return allow
    else
      return allow && canSwipe((target as HTMLElement)?.parentElement)
  }

  return {
    offset,
    isSwiping,
  }
}
