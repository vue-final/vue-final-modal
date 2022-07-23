import { noop } from './index'

export const looseFocus = () => {
  const element = document.activeElement
  if (element && element !== document.body) {
    element.blur()
  }
}

export const getPosition = e => {
  const { clientX: x, clientY: y } = e.targetTouches ? e.targetTouches[0] : e
  return { x, y }
}

export const pointerType = {
  down: {
    pc: 'mousedown',
    m: 'touchstart'
  },
  move: {
    pc: 'mousemove',
    m: 'touchmove'
  },
  up: {
    pc: 'mouseup',
    m: 'touchend'
  }
}

export const addListener = (type, el, callback) => {
  el && el.addEventListener(pointerType[type].pc, callback)
  el && el.addEventListener(pointerType[type].m, callback, { passive: false })
}
export const removeListener = (type, el, callback) => {
  el && el.removeEventListener(pointerType[type].pc, callback)
  el && el.removeEventListener(pointerType[type].m, callback)
}

export function checkPassiveEventSupport(document) {
  if (!document) return false
  let supportsPassive = false
  const optionsBlock = {
    get passive() {
      supportsPassive = true
      return false
    }
  }
  document.addEventListener('x', noop, optionsBlock)
  document.removeEventListener('x', noop)
  return supportsPassive
}
