// stolen from body-scroll-lock and removed ios part

let locks = []
let previousBodyOverflowSetting
let previousBodyPaddingRight

const setOverflowHidden = options => {
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

export const disableBodyScroll = (targetElement, options) => {
  // targetElement must be provided
  if (!targetElement) {
    // eslint-disable-next-line no-console
    console.error(
      'disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.'
    )
    return
  }

  // disableBodyScroll must not have been called on this targetElement before
  if (locks.some(lock => lock.targetElement === targetElement)) {
    return
  }

  const lock = {
    targetElement,
    options: options || {}
  }

  locks = [...locks, lock]

  setOverflowHidden(options)
}

export const enableBodyScroll = targetElement => {
  if (!targetElement) {
    // eslint-disable-next-line no-console
    console.error(
      'enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.'
    )
    return
  }

  locks = locks.filter(lock => lock.targetElement !== targetElement)

  if (!locks.length) {
    restoreOverflowSetting()
  }
}
