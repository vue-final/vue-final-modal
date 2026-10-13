// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { effectScope, ref } from 'vue'
import { useSwipeable } from './useSwipeable'

const scopes: ReturnType<typeof effectScope>[] = []

function swipeable() {
  const el = document.createElement('div')
  document.body.append(el)
  const onSwipe = vi.fn()
  const onSwipeEnd = vi.fn()
  const scope = effectScope()
  scopes.push(scope)
  const state = scope.run(() => useSwipeable(ref(el), { onSwipe, onSwipeEnd }))!
  return { el, onSwipe, onSwipeEnd, ...state }
}

function mouse(target: EventTarget, type: string, clientX: number) {
  target.dispatchEvent(new MouseEvent(type, { bubbles: true, clientX, clientY: 0 }))
}

afterEach(() => {
  scopes.splice(0).forEach(scope => scope.stop())
  document.body.innerHTML = ''
})

describe('useSwipeable', () => {
  it('ends a mouse swipe released outside the element', () => {
    const { el, onSwipe, onSwipeEnd, isSwiping } = swipeable()

    mouse(el, 'mousedown', 0)
    mouse(document.body, 'mousemove', 80)
    mouse(document.body, 'mouseup', 80)

    expect(onSwipe).toHaveBeenCalled()
    expect(onSwipeEnd).toHaveBeenCalledWith(expect.any(MouseEvent), 'right')
    expect(isSwiping.value).toBe(false)
  })
})
