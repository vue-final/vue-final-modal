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

export const clamp = (min, num, max) => {
  return Math.min(Math.max(num, min), max)
}

export const trimPx = distance => {
  return Number(distance.replace(/px$/, '')) || 0
}

export const validDragElement = (e, el, dragSelector) => {
  if (typeof dragSelector !== 'string') return true
  const list = Array.apply(null, el.querySelectorAll(dragSelector))
  return list.includes(e.target)
}

export const getLimit = (vfmContainer, vfmWrapper, vfmContent) => {
  const rectContainer = vfmContainer.getBoundingClientRect()
  const rectContent = vfmContent.getBoundingClientRect()
  return {
    rectContainer,
    rectContent,
    minTop: trimPx(vfmWrapper.style.top) + rectContainer.top - rectContent.top,
    minLeft: trimPx(vfmWrapper.style.left) + rectContainer.left - rectContent.left,
    maxTop: trimPx(vfmWrapper.style.top) + rectContainer.bottom - rectContent.bottom,
    maxLeft: trimPx(vfmWrapper.style.left) + rectContainer.right - rectContent.right
  }
}

export const getWrapperStyle = (wrapperPosition, offset, fitParent, limit, vfmContentAbsolute) => {
  let top = wrapperPosition.top + offset.y
  let left = wrapperPosition.left + offset.x
  if (fitParent) {
    top = clamp(limit.minTop, top, limit.maxTop)
    left = clamp(limit.minLeft, left, limit.maxLeft)
  }
  return {
    top: top + 'px',
    left: left + 'px',
    position: 'relative',
    touchAction: 'none',
    ...(vfmContentAbsolute && {
      height: '-webkit-fill-available',
      width: '-webkit-fill-available'
    })
  }
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
export const addEventListener = (type, el, callback) => {
  el.addEventListener(pointerType[type].pc, callback)
  el.addEventListener(pointerType[type].m, callback, { passive: false })
}
export const removeEventListener = (type, el, callback) => {
  el.removeEventListener(pointerType[type].pc, callback)
  el.removeEventListener(pointerType[type].m, callback)
}

export const addPointerMoving = (moving, ending) => {
  const end = e => {
    ending(e)
    removeEventListener('move', document, moving)
    removeEventListener('up', document, end)
  }
  addEventListener('move', document, moving)
  addEventListener('up', document, end)
}
