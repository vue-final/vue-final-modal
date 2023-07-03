import type { Ref } from 'vue'
import { onBeforeUnmount, watch } from 'vue'
import type CoreModal from './CoreModal.vue'

type BodyScrollOptions = {
  reserveScrollBarGap?: boolean
  allowTouchMove?: (el?: null | HTMLElement) => boolean
}

type Lock = {
  targetElement: HTMLElement
  options?: BodyScrollOptions
}

// stolen from body-scroll-lock

// Older browsers don't support event options, feature detect it.
let hasPassiveEvents = false
if (typeof window !== 'undefined') {
  const passiveTestOptions = {
    get passive() {
      hasPassiveEvents = true
      return undefined
    },
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  window.addEventListener('testPassive', null, passiveTestOptions)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  window.removeEventListener('testPassive', null, passiveTestOptions)
}

const isIosDevice
  = typeof window !== 'undefined'
  && window.navigator
  && window.navigator.platform
  && (/iP(ad|hone|od)/.test(window.navigator.platform)
    || (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1))

let locks: Lock[] = []
let documentListenerAdded = false
let clientY = 0
let initialClientY = -1
let previousBodyOverflowSetting: undefined | string
let previousBodyPaddingRight: undefined | string

const hasScrollbar = (el: HTMLElement) => {
  if (!el || el.nodeType !== Node.ELEMENT_NODE)
    return false

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

const composedPath = (el: null | HTMLElement) => {
  const path = []
  while (el) {
    path.push(el)
    if (el.classList.contains('vfm'))
      return path
    el = el.parentElement
  }
  return path
}

const hasAnyScrollableEl = (el: HTMLElement | null, delta: number) => {
  let hasAnyScrollableEl = false
  const path = composedPath(el)
  path.forEach((el) => {
    if (hasScrollbar(el) && shouldScroll(el, delta))
      hasAnyScrollableEl = true
  })
  return hasAnyScrollableEl
}

// returns true if `el` should be allowed to receive touchmove events.
const allowTouchMove = (el: HTMLElement | null) => locks.some(() => hasAnyScrollableEl(el, -clientY))

const preventDefault = (rawEvent: TouchEvent) => {
  const e = rawEvent || window.event

  // For the case whereby consumers adds a touchmove event listener to document.
  // Recall that we do document.addEventListener('touchmove', preventDefault, { passive: false })
  // in disableBodyScroll - so if we provide this opportunity to allowTouchMove, then
  // the touchmove event on document will break.
  if (allowTouchMove(e.target as HTMLElement | null))
    return true

  // Do not prevent if the event has more than one touch (usually meaning this is a multi touch gesture like pinch to zoom).
  if (e.touches.length > 1)
    return true

  if (e.preventDefault)
    e.preventDefault()

  return false
}

const setOverflowHidden = (options?: BodyScrollOptions) => {
  // If previousBodyPaddingRight is already set, don't set it again.
  if (previousBodyPaddingRight === undefined) {
    const reserveScrollBarGap = !!options && options.reserveScrollBarGap === true
    const scrollBarGap = window.innerWidth - document.documentElement.clientWidth

    if (reserveScrollBarGap && scrollBarGap > 0) {
      const computedBodyPaddingRight = parseInt(getComputedStyle(document.body).getPropertyValue('padding-right'), 10)
      previousBodyPaddingRight = document.body.style.paddingRight
      document.body.style.paddingRight = `${computedBodyPaddingRight + scrollBarGap}px`
    }
  }
  // If previousBodyOverflowSetting is already set, don't set it again.
  if (previousBodyOverflowSetting === undefined) {
    previousBodyOverflowSetting = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
}

const restoreOverflowSetting = () => {
  if (previousBodyPaddingRight !== undefined) {
    document.body.style.paddingRight = previousBodyPaddingRight

    // Restore previousBodyPaddingRight to undefined so setOverflowHidden knows it
    // can be set again.
    previousBodyPaddingRight = undefined
  }

  if (previousBodyOverflowSetting !== undefined) {
    document.body.style.overflow = previousBodyOverflowSetting

    // Restore previousBodyOverflowSetting to undefined
    // so setOverflowHidden knows it can be set again.
    previousBodyOverflowSetting = undefined
  }
}
// https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#Problems_and_solutions
const isTargetElementTotallyScrolled = (targetElement: HTMLElement) =>
  targetElement ? targetElement.scrollHeight - targetElement.scrollTop <= targetElement.clientHeight : false

const handleScroll = (event: TouchEvent, targetElement: HTMLElement) => {
  clientY = event.targetTouches[0].clientY - initialClientY

  if (allowTouchMove(event.target as HTMLElement | null))
    return false

  if (targetElement && targetElement.scrollTop === 0 && clientY > 0) {
    // element is at the top of its scroll.
    return preventDefault(event)
  }

  if (isTargetElementTotallyScrolled(targetElement) && clientY < 0) {
    // element is at the bottom of its scroll.
    return preventDefault(event)
  }

  event.stopPropagation()
  return true
}

export const disableBodyScroll = (targetElement?: HTMLElement, options?: BodyScrollOptions) => {
  // targetElement must be provided
  if (!targetElement) {
    console.error(
      'disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.',
    )
    return
  }

  // disableBodyScroll must not have been called on this targetElement before
  if (locks.some(lock => lock.targetElement === targetElement))
    return

  const lock = {
    targetElement,
    options: options || {},
  }

  locks = [...locks, lock]

  if (isIosDevice) {
    targetElement.ontouchstart = (event: TouchEvent) => {
      if (event.targetTouches.length === 1) {
        // detect single touch.
        initialClientY = event.targetTouches[0].clientY
      }
    }
    targetElement.ontouchmove = (event: TouchEvent) => {
      if (event.targetTouches.length === 1) {
        // detect single touch.
        handleScroll(event, targetElement)
      }
    }

    if (!documentListenerAdded) {
      document.addEventListener('touchmove', preventDefault, hasPassiveEvents ? { passive: false } : undefined)
      documentListenerAdded = true
    }
  }
  else {
    setOverflowHidden(options)
  }
}

export const enableBodyScroll = (targetElement?: HTMLElement) => {
  if (!targetElement) {
    console.error(
      'enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.',
    )
    return
  }

  locks = locks.filter(lock => lock.targetElement !== targetElement)

  if (isIosDevice) {
    targetElement.ontouchstart = null
    targetElement.ontouchmove = null

    if (documentListenerAdded && locks.length === 0) {
      document.removeEventListener('touchmove', preventDefault, (hasPassiveEvents ? { passive: false } : undefined) as any)
      documentListenerAdded = false
    }
  }
  else if (!locks.length) {
    restoreOverflowSetting()
  }
}

export function useLockScroll(props: InstanceType<typeof CoreModal>['$props'], options: {
  lockScrollEl: Ref<undefined | HTMLElement>
  modelValueLocal: Ref<boolean>
}) {
  const { lockScrollEl, modelValueLocal } = options

  let _lockScrollEl: HTMLElement
  watch(lockScrollEl, (val) => {
    if (val)
      _lockScrollEl = val
  }, { immediate: true })

  watch(() => props.lockScroll, (val) => {
    val ? _disableBodyScroll() : _enableBodyScroll()
  })

  onBeforeUnmount(() => {
    _enableBodyScroll()
  })

  function _enableBodyScroll() {
    _lockScrollEl && enableBodyScroll(_lockScrollEl)
  }

  function _disableBodyScroll() {
    if (!modelValueLocal.value)
      return
    props.lockScroll && _lockScrollEl
      && disableBodyScroll(_lockScrollEl, {
        reserveScrollBarGap: props.reserveScrollBarGap,
        allowTouchMove: (el) => {
          while (el && el !== document.body) {
            if (el.getAttribute('vfm-scroll-lock-ignore') !== null)
              return true

            el = el.parentElement
          }
          return false
        },
      })
  }

  return {
    enableBodyScroll: _enableBodyScroll,
    disableBodyScroll: _disableBodyScroll,
  }
}
