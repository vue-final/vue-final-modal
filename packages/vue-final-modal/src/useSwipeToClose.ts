import { useEventListener } from '@vueuse/core'
import type { Ref } from 'vue'
import { computed, ref, watch } from 'vue'
import type CoreModal from './components/CoreModal/CoreModal.vue'
import { useSwipeable } from './useSwipeable'
import { clamp, noop } from './utils'

export function useSwipeToClose(
  props: InstanceType<typeof CoreModal>['$props'],
  options: {
    vfmContentEl: Ref<HTMLDivElement | undefined>
    modelValueLocal: Ref<boolean>
  },
) {
  const { vfmContentEl, modelValueLocal } = options
  const LIMIT_DISTANCE = 0.1
  const LIMIT_SPEED = 300

  const swipeBannerEl = ref<HTMLDivElement>()
  const swipeEl = computed(() => {
    if (props.swipeToClose === undefined || props.swipeToClose === 'none')
      return undefined
    else
      return (props.showSwipeBanner ? swipeBannerEl.value : vfmContentEl.value)
  })

  const offset = ref(0)
  const isCollapsed = ref<boolean | undefined>(true)

  let stopSelectionChange = noop
  let shouldCloseModal = true
  let swipeStart: number
  let allowSwipe = false

  const { lengthX, lengthY, direction: _direction, isSwiping } = useSwipeable(swipeEl, {
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
      if (!isCollapsed.value)
        return
      if (_direction.value !== props.swipeToClose)
        return
      if (_direction.value === 'up') {
        const offsetY = clamp(Math.abs(lengthY.value || 0), 0, swipeEl.value?.offsetHeight || 0) - (props.threshold || 0)
        offset.value = offsetY
      }
      else if (_direction.value === 'down') {
        const offsetY = clamp(Math.abs(lengthY.value || 0), 0, swipeEl.value?.offsetHeight || 0) - (props.threshold || 0)
        offset.value = -offsetY
      }
      else if (_direction.value === 'right') {
        const offsetX = clamp(Math.abs(lengthX.value || 0), 0, swipeEl.value?.offsetWidth || 0) - (props.threshold || 0)
        offset.value = -offsetX
      }
      else if (_direction.value === 'left') {
        const offsetX = clamp(Math.abs(lengthX.value || 0), 0, swipeEl.value?.offsetWidth || 0) - (props.threshold || 0)
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

      const validDirection = _direction === props.swipeToClose
      const validDistance = (() => {
        if (_direction === 'up' || _direction === 'down')
          return Math.abs(lengthY?.value || 0) > LIMIT_DISTANCE * (swipeEl.value?.offsetHeight || 0)
        else if (_direction === 'left' || _direction === 'right')
          return Math.abs(lengthX?.value || 0) > LIMIT_DISTANCE * (swipeEl.value?.offsetWidth || 0)
      })()
      const validSpeed = swipeEnd - swipeStart <= LIMIT_SPEED

      if (shouldCloseModal && allowSwipe && validDirection && (validDistance || validSpeed)) {
        modelValueLocal.value = false
        return
      }

      offset.value = 0
    },
  })

  const bindSwipe = computed(() => {
    if (props.swipeToClose === 'none')
      return
    const translateDirection = (() => {
      switch (props.swipeToClose) {
        case 'up':
        case 'down':
          return 'translateY'
        case 'left':
        case 'right':
          return 'translateX'
      }
    })()
    return {
      class: { 'vfm-bounce-back': !isSwiping.value },
      style: { transform: `${translateDirection}(${-offset.value}px)` },
    }
  })

  watch(
    () => isCollapsed.value,
    (val) => {
      if (!val)
        offset.value = 0
    },
  )

  watch(
    () => modelValueLocal.value,
    (val) => {
      if (val)
        offset.value = 0
    },
  )

  watch(
    () => offset.value,
    (newValue, oldValue) => {
      switch (props.swipeToClose) {
        case 'down':
        case 'right':
          shouldCloseModal = newValue < oldValue
          break
        case 'up':
        case 'left':
          shouldCloseModal = newValue > oldValue
          break
      }
    },
  )

  function onTouchStartSwipeBanner(e: TouchEvent) {
    if (props.preventNavigationGestures)
      e.preventDefault()
  }

  function canSwipe(target?: null | EventTarget): boolean {
    const tagName = (target as HTMLElement)?.tagName
    if (!tagName || ['INPUT', 'TEXTAREA'].includes(tagName))
      return false

    const allow = (() => {
      switch (props.swipeToClose) {
        case 'up':
          return (target as HTMLElement)?.scrollTop + (target as HTMLElement)?.clientHeight === (target as HTMLElement)?.scrollHeight
        case 'left':
          return (target as HTMLElement)?.scrollLeft + (target as HTMLElement)?.clientWidth === (target as HTMLElement)?.scrollWidth
        case 'down':
          return (target as HTMLElement)?.scrollTop === 0
        case 'right':
          return (target as HTMLElement)?.scrollLeft === 0
        default:
          return false
      }
    })()

    if (target === swipeEl.value)
      return allow
    else
      return allow && canSwipe((target as HTMLElement)?.parentElement)
  }

  return {
    vfmContentEl,
    swipeBannerEl,
    bindSwipe,
    onTouchStartSwipeBanner,
  }
}
