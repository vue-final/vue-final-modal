import { useEventListener } from '@vueuse/core'
import type { Ref } from 'vue'
import { computed, ref, watch } from 'vue'
import type { SwiperDirection } from '~/composables/useSwipeable'
import { useSwipeable } from '~/composables/useSwipeable'
import { clamp, noop } from '~/utils'
import type VueFinalModal from '~/components/VueFinalModal.vue'
import type { ComponentProps } from '~/types'

/** Sign of the content offset while the finger moves toward each closing direction. */
const OFFSET_SIGN: Record<SwiperDirection, number> = { up: 1, down: -1, left: 1, right: -1, none: 0 }

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
  const isCollapsed = ref<boolean | undefined>(true)

  let stopSelectionChange = noop
  let shouldCloseModal = true
  let swipeStart = 0
  let allowSwipe = false

  const { lengthX, lengthY, direction, isSwiping } = useSwipeable(swipeEl, {
    threshold: props.threshold,
    onSwipeStart(e) {
      stopSelectionChange = useEventListener(document, 'selectionchange', () => {
        isCollapsed.value = window.getSelection()?.isCollapsed
      })
      swipeStart = Date.now()
      allowSwipe = canSwipe(e.target)
    },
    onSwipe() {
      if (!allowSwipe || !isCollapsed.value || direction.value !== props.swipeToClose)
        return
      offset.value = OFFSET_SIGN[direction.value] * (clamp(swipedLength(), 0, swipeElSize()) - (props.threshold || 0))
    },
    onSwipeEnd(_e, endDirection) {
      stopSelectionChange()
      if (!isCollapsed.value) {
        isCollapsed.value = true
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

  watch(isCollapsed, (val) => {
    if (!val)
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
