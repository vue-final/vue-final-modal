import { setStyle, getPosition, clamp, trimPx, addListener, removeListener } from '../../lib/utils/dragResize'
import { afterTransition, createOpenedModal } from './utils'

function dispatchEvents(el) {
  const mousedownEvent = new MouseEvent('mousedown', { bubbles: true })
  const mousemoveEvent = new MouseEvent('mousemove', { bubbles: true })
  const mouseupEvent = new MouseEvent('mouseup', { bubbles: true })
  el.dispatchEvent(mousedownEvent)
  el.dispatchEvent(mousemoveEvent)
  el.dispatchEvent(mouseupEvent)
  return new Promise(resolve => {
    setTimeout(() => resolve())
  })
}
function getEmittedEvents(type, wrapper) {
  return ['start', 'move', 'end'].reduce((events, event) => {
    const _event = wrapper.emitted(`${type}:${event}`)
    if (_event) {
      events.push(..._event)
    }
    return events
  }, [])
}

describe('drag & resize', () => {
  it('drag', async () => {
    const { wrapper } = await createOpenedModal({ drag: true })
    wrapper.setProps({ drag: false })
    await afterTransition()
    await dispatchEvents(wrapper.find('.vfm__content').element)
    expect(getEmittedEvents('drag', wrapper).length).toBe(0)
    wrapper.setProps({ drag: true })
    await afterTransition()
    await dispatchEvents(wrapper.find('.vfm__content').element)
    expect(getEmittedEvents('drag', wrapper).length).toBe(3)
    wrapper.setProps({ value: false })
    await afterTransition()
    expect(wrapper.find('.vfm').isVisible()).toBe(false)
  })
  it('dragSelector', async () => {
    const { wrapper } = await createOpenedModal(
      { drag: true, fitParant: false, dragSelector: '.modal-content' },
      {},
      {
        slots: {
          default: `
            <div class="modal-content">
              <div class="modal-disabled-drag"></div>
            </div>
          `
        }
      }
    )
    await dispatchEvents(wrapper.find('.modal-disabled-drag').element)
    expect(getEmittedEvents('drag', wrapper).length).toBe(0)
    await dispatchEvents(wrapper.find('.modal-content').element)
    expect(getEmittedEvents('drag', wrapper).length).toBe(3)
  })
  it('resize', async () => {
    const resizeDirections = ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl']
    const { wrapper } = await createOpenedModal({
      resize: true,
      resizeDirections,
      fitParant: false
    })
    wrapper.setProps({ resize: false })
    await afterTransition()
    wrapper.setProps({ resize: true })
    await afterTransition()
    await Promise.allSettled(
      resizeDirections.map(direction => {
        return dispatchEvents(wrapper.find(`.vfm--resize-${direction}`).element)
      })
    )
    expect(getEmittedEvents('resize', wrapper).length).toBe(resizeDirections.length * 3)
    wrapper.setProps({ value: false })
    await afterTransition()
    expect(wrapper.find('.vfm').isVisible()).toBe(false)
  })
  it('resize with absolute vfmContent', async () => {
    const resizeDirections = ['t', 'tr', 'r', 'br']
    const { wrapper } = await createOpenedModal({
      resize: true,
      resizeDirections,
      fitParent: true,
      contentStyle: { position: 'absolute' }
    })
    await Promise.allSettled(
      resizeDirections.map(direction => {
        return dispatchEvents(wrapper.find(`.vfm--resize-${direction}`).element)
      })
    )
    expect(getEmittedEvents('resize', wrapper).length).toBe(resizeDirections.length * 3)
  })
  it('resize with absolute vfmContent', async () => {
    const resizeDirections = ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl']
    const { wrapper } = await createOpenedModal({
      resize: true,
      resizeDirections,
      fitParent: false,
      contentStyle: { position: 'absolute' }
    })
    await Promise.allSettled(
      resizeDirections.map(direction => {
        return dispatchEvents(wrapper.find(`.vfm--resize-${direction}`).element)
      })
    )
    expect(getEmittedEvents('resize', wrapper).length).toBe(resizeDirections.length * 3)
  })
  it('keepChangedStyle', async () => {
    const { wrapper } = await createOpenedModal({ drag: true, keepChangedStyle: true })
    wrapper.setProps({ keepChangedStyle: false })
    await afterTransition()
    expect(wrapper.props().keepChangedStyle).toBe(false)
  })
})

describe('utils: dragResize', () => {
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
    expect(clamp(undefined, -20, undefined)).toBe(-20)
    expect(clamp(10, -20, undefined)).toBe(10)
    expect(clamp(10, 20, undefined)).toBe(20)
    expect(clamp(10, 20, 15)).toBe(15)
    expect(clamp(10, 2, 15)).toBe(10)
    expect(clamp(10, 20, 30)).toBe(20)
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
    addListener('down', downElem, downFn)
    const mousedownEvent = new CustomEvent('mousedown')
    const touchstartEvent = new CustomEvent('touchstart')
    downElem.dispatchEvent(mousedownEvent)
    downElem.dispatchEvent(touchstartEvent)
    expect(downFn).toHaveBeenCalledTimes(2)

    removeListener('down', downElem, downFn)
    downElem.dispatchEvent(mousedownEvent)
    downElem.dispatchEvent(touchstartEvent)
    expect(downFn).toHaveBeenCalledTimes(2)

    const moveElem = document.createElement('div')
    const moveFn = jest.fn()
    addListener('move', moveElem, moveFn)
    const mousemoveEvent = new CustomEvent('mousemove')
    const touchmoveEvent = new CustomEvent('touchmove')
    moveElem.dispatchEvent(mousemoveEvent)
    moveElem.dispatchEvent(touchmoveEvent)
    expect(moveFn).toHaveBeenCalledTimes(2)

    removeListener('move', moveElem, moveFn)
    moveElem.dispatchEvent(mousemoveEvent)
    moveElem.dispatchEvent(touchmoveEvent)
    expect(moveFn).toHaveBeenCalledTimes(2)

    const upElem = document.createElement('div')
    const upFn = jest.fn()
    addListener('up', upElem, upFn)
    const mouseupEvent = new CustomEvent('mouseup')
    const touchendEvent = new CustomEvent('touchend')
    upElem.dispatchEvent(mouseupEvent)
    upElem.dispatchEvent(touchendEvent)
    expect(upFn).toHaveBeenCalledTimes(2)

    removeListener('up', upElem, upFn)
    upElem.dispatchEvent(mouseupEvent)
    upElem.dispatchEvent(touchendEvent)
    expect(upFn).toHaveBeenCalledTimes(2)
  })
})
