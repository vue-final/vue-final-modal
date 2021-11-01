import { watch, ref, nextTick } from 'vue'
import { TransitionState } from './transitionState'

const resizeCursor = {
  t: 'ns-resize',
  tr: 'nesw-resize',
  r: 'ew-resize',
  br: 'nwse-resize',
  b: 'ns-resize',
  bl: 'nesw-resize',
  l: 'ew-resize',
  tl: 'nwse-resize'
}

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

export function useDragResize({
  props,
  visible,
  visibility,
  vfmContainer,
  vfmContent,
  vfmResize,
  modalTransitionState,
  onEvent = () => {}
}) {
  const state = ref(null)
  const dragResizeStyle = ref({})

  watch(modalTransitionState, val => {
    switch (val) {
      case TransitionState.Enter:
        props.drag && addDragDown()
        props.resize && addResizeDown()
        break
      case TransitionState.Leave:
        if (!props.keepChangedStyle) {
          dragResizeStyle.value = {}
        }
        break
    }
  })

  watch(
    () => props.drag,
    val => {
      if (visible.value) {
        val ? addDragDown() : removeDragDown()
      }
    }
  )

  watch(
    () => props.resize,
    val => {
      if (visible.value) {
        val ? addResizeDown() : removeResizeDown()
      }
    }
  )

  watch(
    () => props.keepChangedStyle,
    val => {
      if (!val) {
        dragResizeStyle.value = {}
      }
    }
  )

  function pointerDown(e) {
    e.stopPropagation()
    const STATE_RESIZE = 'resize'
    const STATE_DRAG = 'drag'
    const direction = e.target.getAttribute('direction')
    let _state
    if (direction) {
      _state = STATE_RESIZE
    } else if (validDragElement(e, vfmContent.value, props.dragSelector)) {
      _state = STATE_DRAG
    } else {
      return
    }
    state.value = `${_state}:start`
    onEvent?.(e)
    const down = getPosition(e)
    const rectContainer = vfmContainer.value.getBoundingClientRect()
    const rectContent = vfmContent.value.getBoundingClientRect()
    const isAbsolute = window.getComputedStyle(vfmContent.value).position === 'absolute'
    const position = {
      top: trimPx(dragResizeStyle.value.top),
      left: trimPx(dragResizeStyle.value.left)
    }
    const limit = (() => {
      if (props.fitParent) {
        const limit = {
          absolute() {
            return {
              minTop: 0,
              minLeft: 0,
              maxTop: rectContainer.height - rectContent.height,
              maxLeft: rectContainer.width - rectContent.width
            }
          },
          relative() {
            return {
              minTop: position.top + rectContainer.top - rectContent.top,
              minLeft: position.left + rectContainer.left - rectContent.left,
              maxTop: position.top + rectContainer.bottom - rectContent.bottom,
              maxLeft: position.left + rectContainer.right - rectContent.right
            }
          }
        }
        return isAbsolute ? limit.absolute() : limit.relative()
      } else {
        return {}
      }
    })()
    const resetBodyCursor = _state === STATE_RESIZE && setStyle(document.body, 'cursor', resizeCursor[direction])

    const moving = e => {
      // onPointerMove
      e.stopPropagation()
      state.value = `${_state}:move`
      onEvent?.(e)
      const move = getPosition(e)
      let offset = {
        x: move.x - down.x,
        y: move.y - down.y
      }
      if (_state === STATE_RESIZE) {
        offset = getResizeOffset(direction, offset, rectContainer, rectContent, isAbsolute)
      }

      let top
      let left
      if (isAbsolute) {
        top = rectContent.top - rectContainer.top + offset.y
        left = rectContent.left - rectContainer.left + offset.x
      } else {
        top = position.top + offset.y
        left = position.left + offset.x
      }
      if (_state === STATE_DRAG && props.fitParent) {
        top = clamp(limit.minTop, top, limit.maxTop)
        left = clamp(limit.minLeft, left, limit.maxLeft)
      }
      const style = {
        position: 'relative',
        top: top + 'px',
        left: left + 'px',
        margin: 'unset',
        touchAction: 'none',
        ...(isAbsolute && {
          position: 'absolute',
          transform: 'unset',
          width: rectContent.width + 'px',
          height: rectContent.height + 'px'
        }),
        ...(offset.width && { width: offset.width + 'px' }),
        ...(offset.height && { height: offset.height + 'px' })
      }

      dragResizeStyle.value = {
        ...dragResizeStyle.value,
        ...style
      }
    }
    const end = e => {
      // onPointerUp
      e.stopPropagation()
      if (_state === STATE_RESIZE) {
        resetBodyCursor && resetBodyCursor()
      }
      // Excute onMouseupContainer before trigger onEvent
      setTimeout(() => {
        state.value = `${_state}:end`
        onEvent?.(e)
      })
      removeListener('move', document, moving)
      removeListener('up', document, end)
    }
    addListener('move', document, moving)
    addListener('up', document, end)
  }
  function addDragDown() {
    addListener('down', vfmContent.value, pointerDown)
    dragResizeStyle.value.touchAction = 'none'
  }
  function removeDragDown() {
    removeListener('down', vfmContent.value, pointerDown)
  }
  function addResizeDown() {
    visibility.resize = true
    nextTick(() => {
      addListener('down', vfmResize.value, pointerDown)
    })
  }
  function removeResizeDown() {
    removeListener('down', vfmResize.value, pointerDown)
    visibility.resize = false
  }
  function getResizeOffset(direction, offset, rectContainer, rectContent, isAbsolute) {
    const setOffset = dir => {
      let offsetAxis = offset[dir.axis]
      offsetAxis = props.fitParent ? clamp(dir.min, offsetAxis, dir.max) : offsetAxis
      let edge = clamp(dir.minEdge, dir.getEdge(offsetAxis), dir.maxEdge)
      offsetAxis = dir.getOffsetAxis(edge, isAbsolute)
      return {
        [dir.edgeName]: edge,
        [dir.axis]: offsetAxis
      }
    }

    const getDirectionInfo = (position, edgeName, axis, isPositive) => {
      const rectContentEdge = rectContent[edgeName]
      const positionOffset = rectContainer[position] - rectContent[position]
      const EdgeName = capitalize(edgeName)
      return {
        axis,
        edgeName,
        min: isPositive ? positionOffset : -rectContentEdge,
        max: isPositive ? rectContentEdge : positionOffset,
        minEdge: props[`min${EdgeName}`],
        maxEdge: props[`max${EdgeName}`],
        getEdge: offsetAxis => rectContent[edgeName] - offsetAxis * (isPositive ? 1 : -1),
        getOffsetAxis: (edge, isAbsolute) => {
          const offsetAxis = rectContent[edgeName] - edge
          if (isAbsolute) {
            return isPositive ? offsetAxis : 0
          } else {
            return ((isPositive ? 1 : -1) * offsetAxis) / 2
          }
        }
      }
    }

    const directions = {
      t: ['top', 'height', 'y', true],
      b: ['bottom', 'height', 'y', false],
      l: ['left', 'width', 'x', true],
      r: ['right', 'width', 'x', false]
    }

    let _offset = { x: 0, y: 0 }
    direction.split('').forEach(dir => {
      const directionInfo = getDirectionInfo(...directions[dir])
      _offset = {
        ..._offset,
        ...setOffset(directionInfo)
      }
    })
    return _offset
  }

  return {
    state,
    dragResizeStyle,
    removeDragDown,
    removeResizeDown
  }
}
