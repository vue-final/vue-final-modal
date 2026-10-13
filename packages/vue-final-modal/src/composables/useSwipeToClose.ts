import type { Ref } from 'vue'
import type VueFinalModal from '~/components/VueFinalModal.vue'
import type { SwiperDirection } from '~/composables/useSwipeable'
import type { ComponentProps } from '~/types'
import { useEventListener } from '@vueuse/core'
import { computed, ref, watch } from 'vue'
import { useSwipeable } from '~/composables/useSwipeable'
import { clamp, noop } from '~/utils'

/** Sign of the content offset while the finger moves toward each closing direction. */
const OFFSET_SIGN: Record<SwiperDirection, number> = { up: 1, down: -1, left: 1, right: -1, none: 0 }

/** Selecting text inside the modal holds the swipe so that text can be selected; a selection elsewhere on the page must not. */
function hasSelectionIn(el: HTMLElement | undefined) {
  const selection = window.getSelection()
  if (!el || !selection || selection.isCollapsed)
    return false
  for (let i = 0; i < selection.rangeCount; i++) {
    if (selection.getRangeAt(i).intersectsNode(el))
      return true
  }
  return false
}

export function useSwipeToClose(
  props: ComponentProps<typeof VueFinalModal>,
  options: {
    vfmContentEl: Ref<HTMLDivElement | undefined>
    swipeBannerEl: Ref<HTMLDivElement | undefined>
    modelValueLocal: Ref<boolean>
  },
) {
  const { vfmContentEl, swipeBannerEl, modelValueLocal } = options
  const LIMIT_DISTANCE = 0.1
  const LIMIT_SPEED = 300

  const swipeEl = computed(() => {
    if (props.swipeToClose === 'none')
      return undefined
    return props.showSwipeBanner ? swipeBannerEl.value : vfmContentEl.value
  })
  const vertical = computed(() => props.swipeToClose === 'up' || props.swipeToClose === 'down')

  const offset = ref(0)
  const isSelecting = ref(false)

  let stopSelectionChange = noop
  let shouldCloseModal = true
  let swipeStart = 0
  let allowSwipe = false

  const { lengthX, lengthY, direction, isSwiping } = useSwipeable(swipeEl, {
    threshold: props.threshold,
    onSwipeStart(e) {
      stopSelectionChange = useEventListener(document, 'selectionchange', () => {
        isSelecting.value = hasSelectionIn(vfmContentEl.value)
      })
      swipeStart = Date.now()
      allowSwipe = canSwipe(e.target)
    },
    onSwipe() {
      if (!allowSwipe || isSelecting.value || direction.value !== props.swipeToClose)
        return
      offset.value = OFFSET_SIGN[direction.value] * (clamp(swipedLength(), 0, swipeElSize()) - (props.threshold || 0))
    },
    onSwipeEnd(_e, endDirection) {
      stopSelectionChange()
      if (isSelecting.value) {
        isSelecting.value = false
        return
      }

      const validDistance = swipedLength() > LIMIT_DISTANCE * swipeElSize()
      const validSpeed = Date.now() - swipeStart <= LIMIT_SPEED
      if (shouldCloseModal && allowSwipe && endDirection === props.swipeToClose && (validDistance || validSpeed)) {
        modelValueLocal.value = false
        return
      }

      offset.value = 0
    },
  })

  function swipedLength() {
    return Math.abs(vertical.value ? lengthY.value : lengthX.value)
  }

  function swipeElSize() {
    return (vertical.value ? swipeEl.value?.offsetHeight : swipeEl.value?.offsetWidth) || 0
  }

  const bindSwipe = computed(() => {
    if (props.swipeToClose === 'none')
      return
    return {
      class: { 'vfm-bounce-back': !isSwiping.value },
      style: { transform: `${vertical.value ? 'translateY' : 'translateX'}(${-offset.value}px)` },
    }
  })

  watch(isSelecting, (val) => {
    if (val)
      offset.value = 0
  })

  watch(modelValueLocal, (val) => {
    if (val)
      offset.value = 0
  })

  /** Only a swipe still heading toward the closing direction when released may close. */
  watch(offset, (newValue, oldValue) => {
    shouldCloseModal = OFFSET_SIGN[props.swipeToClose ?? 'none'] * (newValue - oldValue) > 0
  })

  function onTouchStartSwipeBanner(e: TouchEvent) {
    if (props.preventNavigationGestures)
      e.preventDefault()
  }

  /** Swiping may only start where nothing can scroll further in the closing direction, up to the swipe element. */
  function canSwipe(target: EventTarget | null): boolean {
    const el = target as HTMLElement | null
    if (!el?.tagName || ['INPUT', 'TEXTAREA'].includes(el.tagName))
      return false

    if (!scrolledToEdge(el))
      return false
    return el === swipeEl.value || canSwipe(el.parentElement)
  }

  function scrolledToEdge(el: HTMLElement) {
    switch (props.swipeToClose) {
      case 'up': return el.scrollTop + el.clientHeight === el.scrollHeight
      case 'left': return el.scrollLeft + el.clientWidth === el.scrollWidth
      case 'down': return el.scrollTop === 0
      case 'right': return el.scrollLeft === 0
      default: return false
    }
  }

  return {
    bindSwipe,
    onTouchStartSwipeBanner,
  }
}
