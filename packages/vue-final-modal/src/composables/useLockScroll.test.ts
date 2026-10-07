// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'

/** scroll-lock reads the user agent once, when it is imported. */
async function importOnIOS() {
  vi.resetModules()
  Object.defineProperty(window.navigator, 'userAgent', {
    value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
    configurable: true,
  })
  const vue = await import('vue')
  const vfm = await import('../index')
  return { ...vue, ...vfm }
}

function touch(type: 'touchstart' | 'touchmove', target: Element, clientY: number) {
  const event = new Event(type, { bubbles: true, cancelable: true })
  const touches = [{ clientX: 0, clientY }]
  Object.defineProperties(event, { touches: { value: touches }, targetTouches: { value: touches } })
  target.dispatchEvent(event)
  return event
}

afterEach(() => {
  document.body.innerHTML = ''
  document.body.removeAttribute('style')
})

describe('lockScroll in a scroll container', () => {
  it('keeps a container two modals share locked until the last of them closes', async () => {
    vi.resetModules()
    const { createApp, h, reactive } = await import('vue')
    const { VueFinalModal, createVfm } = await import('../index')
    const container = document.body.appendChild(document.createElement('div'))
    container.style.overflowY = 'auto'
    const open = reactive({ first: true, second: false })
    const app = createApp({
      render: () => [
        h(VueFinalModal, { modelValue: open.first, teleportTo: false, focusTrap: false }),
        h(VueFinalModal, { modelValue: open.second, teleportTo: false, focusTrap: false }),
      ],
    })
    const openModals = () => container.querySelectorAll('.vfm').length
    app.use(createVfm()).mount(container)
    await expect.poll(openModals).toBe(1)

    open.second = true
    await expect.poll(openModals).toBe(2)
    open.first = false
    await expect.poll(openModals).toBe(1)

    expect(container.style.overflowY).toBe('hidden')
    app.unmount()
  })
})

describe('lockScroll on iOS', () => {
  it('keeps the scroll container a modal is rendered in from scrolling behind it', async () => {
    const { createApp, h, nextTick, VueFinalModal, createVfm } = await importOnIOS()
    const container = document.body.appendChild(document.createElement('div'))
    container.style.overflowY = 'auto'
    Object.defineProperties(container, {
      scrollTop: { value: 50, writable: true },
      scrollHeight: { value: 1000 },
      clientHeight: { value: 200 },
    })
    const app = createApp({
      render: () => h(VueFinalModal, { modelValue: true, teleportTo: false, focusTrap: false }, () => h('p', { class: 'text' }, 'Hello')),
    })
    app.use(createVfm()).mount(container)
    await nextTick()
    await nextTick()

    const text = container.querySelector('.text')!
    touch('touchstart', text, 100)
    expect(touch('touchmove', text, 150).defaultPrevented).toBe(true)
    app.unmount()
  })
})
