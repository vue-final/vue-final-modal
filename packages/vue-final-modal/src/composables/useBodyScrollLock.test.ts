// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'

/** Every lock is released after the test: the document listener of a lock left behind would outlive the module. */
const releaseLocks: (() => void)[] = []

/** `isIosDevice` is read once at import, so each test gets a fresh module after setting the platform. */
async function loadScrollLock(platform = '') {
  vi.resetModules()
  Object.defineProperty(window.navigator, 'platform', { value: platform, configurable: true })
  const { disableBodyScroll, enableBodyScroll } = await import('./useBodyScrollLock')
  return {
    enableBodyScroll,
    disableBodyScroll: (...args: Parameters<typeof disableBodyScroll>) => {
      disableBodyScroll(...args)
      releaseLocks.push(() => enableBodyScroll(args[0]))
    },
  }
}

function scrollable(parent: Element, { scrollTop = 0, scrollHeight = 200, clientHeight = 100 } = {}) {
  const el = document.createElement('div')
  el.style.overflowY = 'auto'
  Object.defineProperties(el, {
    scrollTop: { value: scrollTop, writable: true },
    scrollHeight: { value: scrollHeight },
    clientHeight: { value: clientHeight },
  })
  parent.appendChild(el)
  return el
}

function touchmove(target: Element, touches: { clientY: number }[]) {
  const event = new Event('touchmove', { bubbles: true, cancelable: true }) as TouchEvent
  Object.defineProperties(event, {
    touches: { value: touches },
    targetTouches: { value: touches },
  })
  target.dispatchEvent(event)
  return event
}

afterEach(() => {
  releaseLocks.splice(0).forEach(release => release())
  document.body.innerHTML = ''
  document.body.removeAttribute('style')
})

describe('body scroll lock', () => {
  it('hides the body overflow while locked and restores the inline value afterwards', async () => {
    const { disableBodyScroll, enableBodyScroll } = await loadScrollLock()
    const modal = document.body.appendChild(document.createElement('div'))
    document.body.style.overflow = 'auto'

    disableBodyScroll(modal)
    expect(document.body.style.overflow).toBe('hidden')

    enableBodyScroll(modal)
    expect(document.body.style.overflow).toBe('auto')
  })

  it('restores an empty overflow', async () => {
    const { disableBodyScroll, enableBodyScroll } = await loadScrollLock()
    const modal = document.body.appendChild(document.createElement('div'))

    disableBodyScroll(modal)
    enableBodyScroll(modal)

    expect(document.body.style.overflow).toBe('')
  })

  it('keeps the body locked until every element released it', async () => {
    const { disableBodyScroll, enableBodyScroll } = await loadScrollLock()
    const first = document.body.appendChild(document.createElement('div'))
    const second = document.body.appendChild(document.createElement('div'))

    disableBodyScroll(first)
    disableBodyScroll(second)
    enableBodyScroll(first)
    expect(document.body.style.overflow).toBe('hidden')

    enableBodyScroll(second)
    expect(document.body.style.overflow).toBe('')
  })

  it('counts the same element once, so one release unlocks it', async () => {
    const { disableBodyScroll, enableBodyScroll } = await loadScrollLock()
    const modal = document.body.appendChild(document.createElement('div'))

    disableBodyScroll(modal)
    disableBodyScroll(modal)
    enableBodyScroll(modal)

    expect(document.body.style.overflow).toBe('')
  })

  it('ignores a release from an element that holds no lock', async () => {
    const { disableBodyScroll, enableBodyScroll } = await loadScrollLock()
    const holder = document.body.appendChild(document.createElement('div'))
    const other = document.body.appendChild(document.createElement('div'))

    disableBodyScroll(holder)
    enableBodyScroll(other)
    enableBodyScroll(other)

    expect(document.body.style.overflow).toBe('hidden')
  })

  it('widens the body padding by the scrollbar gap when reserved, and restores it', async () => {
    const { disableBodyScroll, enableBodyScroll } = await loadScrollLock()
    const modal = document.body.appendChild(document.createElement('div'))
    document.body.style.paddingRight = '10px'
    const gap = window.innerWidth - document.documentElement.clientWidth
    expect(gap).toBeGreaterThan(0)

    disableBodyScroll(modal, { reserveScrollBarGap: true })
    expect(document.body.style.paddingRight).toBe(`${10 + gap}px`)

    enableBodyScroll(modal)
    expect(document.body.style.paddingRight).toBe('10px')
  })

  it('leaves the body padding alone when the gap is not reserved', async () => {
    const { disableBodyScroll } = await loadScrollLock()
    const modal = document.body.appendChild(document.createElement('div'))
    document.body.style.paddingRight = '10px'

    disableBodyScroll(modal, { reserveScrollBarGap: false })

    expect(document.body.style.paddingRight).toBe('10px')
  })

  it('reserves the gap once for nested locks and restores it with the last release', async () => {
    const { disableBodyScroll, enableBodyScroll } = await loadScrollLock()
    const first = document.body.appendChild(document.createElement('div'))
    const second = document.body.appendChild(document.createElement('div'))
    const gap = window.innerWidth - document.documentElement.clientWidth

    disableBodyScroll(first, { reserveScrollBarGap: true })
    disableBodyScroll(second, { reserveScrollBarGap: true })
    expect(document.body.style.paddingRight).toBe(`${gap}px`)

    enableBodyScroll(first)
    expect(document.body.style.paddingRight).toBe(`${gap}px`)

    enableBodyScroll(second)
    expect(document.body.style.paddingRight).toBe('')
  })

  it('installs no touch handlers off iOS', async () => {
    const { disableBodyScroll } = await loadScrollLock()
    const modal = document.body.appendChild(document.createElement('div'))

    disableBodyScroll(modal)

    expect(modal.ontouchmove).toBeNull()
    expect(touchmove(modal, [{ clientY: 10 }]).defaultPrevented).toBe(false)
  })
})

describe('body scroll lock on iOS', () => {
  it('leaves the body overflow alone and blocks touchmove on the document instead', async () => {
    const { disableBodyScroll } = await loadScrollLock('iPhone')
    const modal = document.body.appendChild(document.createElement('div'))

    disableBodyScroll(modal)

    expect(document.body.style.overflow).toBe('')
    expect(touchmove(document.body, [{ clientY: 10 }]).defaultPrevented).toBe(true)
  })

  it('lets a multi-touch gesture through', async () => {
    const { disableBodyScroll } = await loadScrollLock('iPhone')
    const modal = document.body.appendChild(document.createElement('div'))

    disableBodyScroll(modal)

    expect(touchmove(document.body, [{ clientY: 10 }, { clientY: 20 }]).defaultPrevented).toBe(false)
  })

  it('lets touchmove through inside a scrollable area of a modal that can still scroll that way', async () => {
    const { disableBodyScroll } = await loadScrollLock('iPhone')
    const modal = document.body.appendChild(document.createElement('div'))
    modal.className = 'vfm'
    const inner = scrollable(modal, { scrollTop: 50 }).appendChild(document.createElement('p'))

    disableBodyScroll(modal)

    expect(touchmove(inner, [{ clientY: 10 }]).defaultPrevented).toBe(false)
  })

  it('blocks touchmove inside an area that has nothing left to scroll', async () => {
    const { disableBodyScroll } = await loadScrollLock('iPhone')
    const modal = document.body.appendChild(document.createElement('div'))
    modal.className = 'vfm'
    const inner = scrollable(modal, { scrollHeight: 100, clientHeight: 100 }).appendChild(document.createElement('p'))

    disableBodyScroll(modal)

    expect(touchmove(inner, [{ clientY: 10 }]).defaultPrevented).toBe(true)
  })

  it('blocks pulling the locked element past its top or bottom, and lets it scroll in between', async () => {
    const { disableBodyScroll } = await loadScrollLock('iPhone')
    const modal = scrollable(document.body)

    disableBodyScroll(modal)
    const pull = (from: number, to: number) => {
      modal.ontouchstart!({ targetTouches: [{ clientY: from }] } as unknown as TouchEvent)
      const event = touchmove(modal, [{ clientY: to }])
      return event.defaultPrevented
    }

    modal.scrollTop = 0
    expect(pull(100, 150)).toBe(true)

    modal.scrollTop = 100
    expect(pull(100, 50)).toBe(true)

    modal.scrollTop = 50
    expect(pull(100, 50)).toBe(false)
  })

  it('removes the handlers and the document listener once the last lock is released', async () => {
    const { disableBodyScroll, enableBodyScroll } = await loadScrollLock('iPhone')
    const first = document.body.appendChild(document.createElement('div'))
    const second = document.body.appendChild(document.createElement('div'))

    disableBodyScroll(first)
    disableBodyScroll(second)
    enableBodyScroll(first)
    expect(first.ontouchmove).toBeNull()
    expect(touchmove(document.body, [{ clientY: 10 }]).defaultPrevented).toBe(true)

    enableBodyScroll(second)
    expect(touchmove(document.body, [{ clientY: 10 }]).defaultPrevented).toBe(false)
  })
})
