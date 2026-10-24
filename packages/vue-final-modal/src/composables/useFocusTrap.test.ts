// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { lastPress } from './useFocusTrap'

function press(button: Element) {
  button.dispatchEvent(new Event('pointerdown', { bubbles: true }))
}

function click(button: Element) {
  button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
}

function buttons(count: number) {
  return Array.from({ length: count }, () => document.body.appendChild(document.createElement('button')))
}

afterEach(() => {
  vi.useRealTimers()
  document.body.innerHTML = ''
})

describe('lastPress()', () => {
  it('forgets a press once its click has run', () => {
    vi.useFakeTimers()
    lastPress()
    const [button] = buttons(1)

    press(button!)
    click(button!)
    expect(lastPress()).toBe(button)
    vi.runAllTimers()
    expect(lastPress()).toBeNull()
  })

  it('keeps a press that comes before the timer of the previous click ran, as on a busy page', () => {
    vi.useFakeTimers()
    lastPress()
    const [first, second] = buttons(2)

    press(first!)
    click(first!)
    press(second!)
    vi.runAllTimers()
    expect(lastPress()).toBe(second)
  })

  it('knows the press that opens the first modal once a vfm is created', async () => {
    vi.resetModules()
    const { createVfm } = await import('../plugin')
    const { lastPress: freshLastPress } = await import('./useFocusTrap')
    createVfm()
    const [button] = buttons(1)

    press(button!)
    click(button!)
    expect(freshLastPress()).toBe(button)
  })
})
