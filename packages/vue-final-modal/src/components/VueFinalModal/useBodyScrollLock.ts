import type { Ref } from 'vue'
import { onBeforeUnmount, watch } from 'vue'
import type VueFinalModal from './VueFinalModal.vue'

type BodyScrollOptions = {
  reserveScrollBarGap?: boolean
  allowTouchMove?: (el?: null | HTMLElement) => boolean
}

type Lock = {
  targetElement: HTMLElement
  options?: BodyScrollOptions
}

type AxisType = 'x' | 'y'

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
let client: Record<AxisType, number> = { x: 0, y: 0 }
let initialClient: Record<AxisType, number> = { x: -1, y: -1 }
let previousBodyOverflowSetting: undefined | string
let previousBodyPaddingRight: undefined | string
let axis: AxisType | null = null

const hasScrollbar = (el: HTMLElement, axis: AxisType) => {
  if (!el || el.nodeType !== Node.ELEMENT_NODE)
    return false

  const style = window.getComputedStyle(el)
  const overflow = style[`overflow${axis === 'y' ? 'Y' : 'X'}`]
  const totalScroll = el[`scroll${axis === 'y' ? 'Height' : 'Width'}`]
  const clientSize = el[`client${axis === 'y' ? 'Height' : 'Width'}`]

  return ['auto', 'scroll'].includes(overflow) && totalScroll > clientSize
}

const shouldScroll = (el: HTMLElement, delta: number, axis: AxisType) => {
  const totalScroll = el[`scroll${axis === 'y' ? 'Height' : 'Width'}`]
  const scrolled = el[`scroll${axis === 'y' ? 'Top' : 'Left'}`]
  const clientSize = el[`client${axis === 'y' ? 'Height' : 'Width'}`]

  if (scrolled === 0 && delta < 0)
    return false
  if (scrolled + clientSize + delta >= totalScroll && delta > 0)
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

const hasAnyScrollableEl = (el: HTMLElement | null) => {
  const path = composedPath(el)
  for (const el of path) {
    if (hasScrollbar(el, 'y') && shouldScroll(el, -client.y, 'y'))
      return true

    if (hasScrollbar(el, 'x') && shouldScroll(el, -client.x, 'x'))
      return true
  }
  return false
}

// returns true if `el` should be allowed to receive touchmove events.
const allowTouchMove = (el: HTMLElement | null) => locks.some(() => hasAnyScrollableEl(el))

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
const isTargetElementTotallyScrolled = (targetElement: any, axis: AxisType): boolean => {
  if (targetElement) {
    const totalScroll = targetElement[`scroll${axis === 'y' ? 'Height' : 'Width'}`]
    const scrolled = targetElement[`scroll${axis === 'y' ? 'Top' : 'Left'}`]
    const clientSize = targetElement[`client${axis === 'y' ? 'Height' : 'Width'}`]
    return totalScroll - scrolled <= clientSize
  }
  return false
}

const handleScroll = (event: TouchEvent, targetElement: HTMLElement, axis: AxisType) => {
  const touch = event.targetTouches[0]
  client = {
    x: touch.clientX - initialClient.x,
    y: touch.clientY - initialClient.y,
  }
  const initialPos = initialClient[axis]
  const scrollPos = targetElement && targetElement[`scroll${axis === 'y' ? 'Top' : 'Left'}`]
  const clientPos = (axis === 'y' ? touch.clientY : touch.clientX) - initialPos

  if (allowTouchMove(event.target as HTMLElement | null))
    return false

  if (targetElement && scrollPos === 0 && clientPos > 0) {
    // element is at the top of its scroll.
    return preventDefault(event)
  }

  if (isTargetElementTotallyScrolled(targetElement, axis) && clientPos < 0) {
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
        initialClient = {
          x: event.targetTouches[0].clientX,
          y: event.targetTouches[0].clientY,
        }
      }
    }
    targetElement.ontouchmove = (event: TouchEvent) => {
      if (event.targetTouches.length === 1) {
        // detect single touch.
        if (!axis) {
          const distX = Math.abs(initialClient.x - event.targetTouches[0].clientX)
          const distY = Math.abs(initialClient.y - event.targetTouches[0].clientY)
          axis = distX > distY ? 'x' : 'y'
        }
        handleScroll(event, targetElement, axis)
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

export function useLockScroll(props: InstanceType<typeof VueFinalModal>['$props'], options: {
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
