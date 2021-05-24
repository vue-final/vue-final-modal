export const setStyle = (el, key, value) => {
  const cacheStyle = el.style[key]
  el.style[key] = value
  return () => {
    el.style[key] = cacheStyle
  }
}

export const getPosition = e => {
  const { clientX: x, clientY: y } = e.targetTouches ? e.targetTouches[0] : e
  return { x, y }
}

export const capitalize = s => {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export const clamp = (min, num, max) => {
  if (typeof min !== 'number') {
    min = Math.min(num, max) || num
  }
  if (typeof max !== 'number') {
    max = Math.max(num, min)
  }
  return Math.min(Math.max(num, min), max)
}

export const trimPx = distance => {
  return (distance && Number(distance.replace(/px$/, ''))) || 0
}

export const validDragElement = (e, el, dragSelector) => {
  if (dragSelector === '') return true
  const list = [...el.querySelectorAll(dragSelector)]
  return list.includes(e.target)
}

const pointerType = {
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
