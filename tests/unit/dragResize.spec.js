import {
  setStyle,
  getPosition,
  clamp,
  trimPx,
  addEventListener,
  removeEventListener,
  addPointerMoving
} from '../../lib/utils/dragResize'

describe('dragResize', () => {
  it('setStyle', () => {
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

    Object.values(resizeCursor).forEach(cursor => {
      const elem = document.createElement('div')
      const defaultCursor = elem.style.cursor
      const resetStyle = setStyle(elem, 'cursor', cursor)
      expect(elem.style.cursor).toBe(cursor)
      resetStyle()
      expect(elem.style.cursor).toBe(defaultCursor)
    })
  })

  it('getPosition', () => {
    const result = { x: 0, y: 0 }
    const touchesEvent = {
      targetTouches: [{ clientX: 0, clientY: 0 }]
    }
    const clickEvent = {
      clientX: 0,
      clientY: 0
    }
    expect(getPosition(touchesEvent)).toEqual(result)
    expect(getPosition(clickEvent)).toEqual(result)
  })

  it('clamp', () => {
    expect(clamp(0, 50, 100)).toBe(50)
    expect(clamp(0, -100, 100)).toBe(0)
    expect(clamp(0, 200, 100)).toBe(100)
  })

  it('trimPx', () => {
    expect(trimPx('100px')).toBe(100)
    expect(trimPx('100%')).toBe(0)
    expect(trimPx('100')).toBe(100)
    expect(trimPx('0px')).toBe(0)
    expect(trimPx('0%')).toBe(0)
    expect(trimPx('0')).toBe(0)
    expect(trimPx('')).toBe(0)
  })

  it('add & remove EventListener', () => {
    const downElem = document.createElement('div')
    const downFn = jest.fn()
    addEventListener('down', downElem, downFn)
    const mousedownEvent = new CustomEvent('mousedown')
    const touchstartEvent = new CustomEvent('touchstart')
    downElem.dispatchEvent(mousedownEvent)
    downElem.dispatchEvent(touchstartEvent)
    expect(downFn).toHaveBeenCalledTimes(2)

    removeEventListener('down', downElem, downFn)
    downElem.dispatchEvent(mousedownEvent)
    downElem.dispatchEvent(touchstartEvent)
    expect(downFn).toHaveBeenCalledTimes(2)

    const moveElem = document.createElement('div')
    const moveFn = jest.fn()
    addEventListener('move', moveElem, moveFn)
    const mousemoveEvent = new CustomEvent('mousemove')
    const touchmoveEvent = new CustomEvent('touchmove')
    moveElem.dispatchEvent(mousemoveEvent)
    moveElem.dispatchEvent(touchmoveEvent)
    expect(moveFn).toHaveBeenCalledTimes(2)

    removeEventListener('move', moveElem, moveFn)
    moveElem.dispatchEvent(mousemoveEvent)
    moveElem.dispatchEvent(touchmoveEvent)
    expect(moveFn).toHaveBeenCalledTimes(2)

    const upElem = document.createElement('div')
    const upFn = jest.fn()
    addEventListener('up', upElem, upFn)
    const mouseupEvent = new CustomEvent('mouseup')
    const touchendEvent = new CustomEvent('touchend')
    upElem.dispatchEvent(mouseupEvent)
    upElem.dispatchEvent(touchendEvent)
    expect(upFn).toHaveBeenCalledTimes(2)

    removeEventListener('up', upElem, upFn)
    upElem.dispatchEvent(mouseupEvent)
    upElem.dispatchEvent(touchendEvent)
    expect(upFn).toHaveBeenCalledTimes(2)
  })

  it('addPointerMoving', () => {
    const moving = jest.fn()
    const ending = jest.fn()
    const mousemoveEvent = new CustomEvent('mousemove')
    const mouseupEvent = new CustomEvent('mouseup')
    addPointerMoving(moving, ending)
    document.dispatchEvent(mousemoveEvent)
    document.dispatchEvent(mouseupEvent)
    expect(moving).toHaveBeenCalledTimes(1)
    expect(ending).toHaveBeenCalledTimes(1)

    addPointerMoving(moving, ending)
    const touchmoveEvent = new CustomEvent('touchmove')
    const touchendEvent = new CustomEvent('touchend')
    document.dispatchEvent(touchmoveEvent)
    document.dispatchEvent(touchendEvent)
    expect(moving).toHaveBeenCalledTimes(2)
    expect(ending).toHaveBeenCalledTimes(2)

    document.dispatchEvent(mousemoveEvent)
    document.dispatchEvent(mouseupEvent)
    document.dispatchEvent(touchmoveEvent)
    document.dispatchEvent(touchendEvent)
    expect(moving).toHaveBeenCalledTimes(2)
    expect(ending).toHaveBeenCalledTimes(2)
  })
})
