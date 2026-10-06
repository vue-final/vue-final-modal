import type { Ref } from 'vue'
import { onBeforeUnmount, watch } from 'vue'
import type VueFinalModal from '~/components/VueFinalModal.vue'
import type { ComponentProps } from '~/types'

/** A trimmed body-scroll-lock: on iOS, touchmove is allowed only inside scrollable elements of the modal. */

const isIosDevice
  = typeof window !== 'undefined'
  && window.navigator?.platform
  && (/iP(ad|hone|od)/.test(window.navigator.platform)
    || (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1))

let locks: HTMLElement[] = []
let documentListenerAdded = false
let clientY = 0
let initialClientY = -1
let previousBodyOverflowSetting: undefined | string
let previousBodyPaddingRight: undefined | string

const hasScrollbar = (el: HTMLElement) => {
  const style = window.getComputedStyle(el)
  return ['auto', 'scroll'].includes(style.overflowY) && el.scrollHeight > el.clientHeight
}

const shouldScroll = (el: HTMLElement, delta: number) => {
  if (el.scrollTop === 0 && delta < 0)
    return false
  if (el.scrollTop + el.clientHeight + delta >= el.scrollHeight && delta > 0)
    return false
  return true
}

const pathUpToModal = (el: null | HTMLElement) => {
  const path = []
  while (el) {
    path.push(el)
    if (el.classList.contains('vfm'))
      break
    el = el.parentElement
  }
  return path
}

const allowTouchMove = (el: HTMLElement | null) =>
  locks.length > 0 && pathUpToModal(el).some(el => hasScrollbar(el) && shouldScroll(el, -clientY))

const preventDefault = (e: TouchEvent) => {
  if (allowTouchMove(e.target as HTMLElement | null))
    return true
  /** More than one touch is usually a gesture such as pinch to zoom. */
  if (e.touches.length > 1)
    return true
  e.preventDefault()
  return false
}

const setOverflowHidden = (reserveScrollBarGap?: boolean) => {
  if (previousBodyPaddingRight === undefined) {
    const scrollBarGap = window.innerWidth - document.documentElement.clientWidth
    if (reserveScrollBarGap && scrollBarGap > 0) {
      const computedBodyPaddingRight = parseInt(getComputedStyle(document.body).getPropertyValue('padding-right'), 10)
      previousBodyPaddingRight = document.body.style.paddingRight
      document.body.style.paddingRight = `${computedBodyPaddingRight + scrollBarGap}px`
    }
  }
  if (previousBodyOverflowSetting === undefined) {
    previousBodyOverflowSetting = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
}

const restoreOverflowSetting = () => {
  if (previousBodyPaddingRight !== undefined) {
    document.body.style.paddingRight = previousBodyPaddingRight
    previousBodyPaddingRight = undefined
  }
  if (previousBodyOverflowSetting !== undefined) {
    document.body.style.overflow = previousBodyOverflowSetting
    previousBodyOverflowSetting = undefined
  }
}

/** https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#Problems_and_solutions */
const isTotallyScrolled = (el: HTMLElement) => el.scrollHeight - el.scrollTop <= el.clientHeight

const handleScroll = (event: TouchEvent, targetElement: HTMLElement) => {
  clientY = event.targetTouches[0].clientY - initialClientY

  if (allowTouchMove(event.target as HTMLElement | null))
    return false
  if (targetElement.scrollTop === 0 && clientY > 0)
    return preventDefault(event)
  if (isTotallyScrolled(targetElement) && clientY < 0)
    return preventDefault(event)

  event.stopPropagation()
  return true
}

export const disableBodyScroll = (targetElement: HTMLElement, options?: { reserveScrollBarGap?: boolean }) => {
  if (locks.includes(targetElement))
    return
  locks = [...locks, targetElement]

  if (!isIosDevice) {
    setOverflowHidden(options?.reserveScrollBarGap)
    return
  }

  targetElement.ontouchstart = (event: TouchEvent) => {
    if (event.targetTouches.length === 1)
      initialClientY = event.targetTouches[0].clientY
  }
  targetElement.ontouchmove = (event: TouchEvent) => {
    if (event.targetTouches.length === 1)
      handleScroll(event, targetElement)
  }
  if (!documentListenerAdded) {
    document.addEventListener('touchmove', preventDefault, { passive: false })
    documentListenerAdded = true
  }
}

export const enableBodyScroll = (targetElement: HTMLElement) => {
  locks = locks.filter(lock => lock !== targetElement)

  if (!isIosDevice) {
    if (!locks.length)
      restoreOverflowSetting()
    return
  }

  targetElement.ontouchstart = null
  targetElement.ontouchmove = null
  if (documentListenerAdded && locks.length === 0) {
    document.removeEventListener('touchmove', preventDefault)
    documentListenerAdded = false
  }
}

export function useLockScroll(props: ComponentProps<typeof VueFinalModal>, options: {
  lockScrollEl: Ref<undefined | HTMLElement>
  modelValueLocal: Ref<boolean>
}) {
  const { lockScrollEl, modelValueLocal } = options

  /** Kept after the element left the DOM, so the lock it holds can still be released. */
  let el: HTMLElement | undefined
  watch(lockScrollEl, (val) => {
    if (val)
      el = val
  }, { immediate: true })

  watch(() => props.lockScroll, locked => locked ? disable() : enable())
  onBeforeUnmount(enable)

  function enable() {
    if (el)
      enableBodyScroll(el)
  }

  function disable() {
    if (el && props.lockScroll && modelValueLocal.value)
      disableBodyScroll(el, { reserveScrollBarGap: props.reserveScrollBarGap })
  }

  return {
    enableBodyScroll: enable,
    disableBodyScroll: disable,
  }
}
