// @vitest-environment jsdom
import type { VNode } from 'vue'
import { createApp, h, nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import { ModalsContainer, VueFinalModal, createVfm, useModal } from '../index'
import { ALREADY_CLOSED, ALREADY_OPENED, CLOSE_STOPPED, DESTROYED, OPEN_STOPPED } from '../utils'

const apps: { unmount: () => void }[] = []

function mountApp(render: () => VNode | undefined = () => undefined) {
  const el = document.createElement('div')
  document.body.append(el)
  const vfm = createVfm()
  const app = createApp({ render: () => [render(), h(ModalsContainer)] })
  app.use(vfm).mount(el)
  apps.push(app)
  return { app, vfm }
}

function settled<T>(promise: Promise<T> | undefined) {
  return Promise.race([promise, new Promise(resolve => setTimeout(resolve, 1000, 'still pending'))])
}

const stop = (event: { stop: () => void }) => event.stop()

afterEach(() => {
  apps.splice(0).forEach(app => app.unmount())
  document.body.innerHTML = ''
})

describe('useModal() promises', () => {
  it('settles open() when beforeOpen stops it, and drops the modal', async () => {
    const { vfm } = mountApp()
    const modal = useModal({ attrs: { focusTrap: false, onBeforeOpen: stop } })

    await expect(settled(modal.open())).resolves.toBe(OPEN_STOPPED)
    await nextTick()
    expect(vfm.modals).toHaveLength(0)
  })

  it('settles close() when beforeClose stops it, and keeps the modal open', async () => {
    mountApp()
    const modal = useModal({ attrs: { focusTrap: false, onBeforeClose: stop }, slots: { default: 'Kept' } })

    await expect(settled(modal.open())).resolves.toBe('opened')
    await expect(settled(modal.close())).resolves.toBe(CLOSE_STOPPED)
    expect(document.querySelector('.vfm')?.textContent).toContain('Kept')
  })

  it('opens again after Esc when its emits listen to update:modelValue', async () => {
    mountApp()
    const updates: boolean[] = []
    const modal = useModal({
      attrs: { focusTrap: false },
      emits: { 'onUpdate:modelValue': (value: boolean) => updates.push(value) },
    })
    await settled(modal.open())

    document.querySelector('.vfm')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await expect.poll(() => document.querySelector('.vfm')).toBeNull()

    await expect(settled(modal.open())).resolves.toBe('opened')
    expect(updates).toEqual([false])
  })

  it('opens although its attrs carry a modelValue', async () => {
    mountApp()
    const modal = useModal({ attrs: { focusTrap: false, modelValue: false } })

    await expect(settled(modal.open())).resolves.toBe('opened')
  })

  it('settles open() when the modal is destroyed before it finishes opening', async () => {
    mountApp()
    const modal = useModal({ attrs: { focusTrap: false } })

    const opened = modal.open()
    modal.destroy()
    await expect(settled(opened)).resolves.toBe(DESTROYED)
  })

  it('settles close() when the modal is destroyed before it finishes closing', async () => {
    mountApp()
    const modal = useModal({ attrs: { focusTrap: false } })
    await settled(modal.open())

    const closed = modal.close()
    modal.destroy()
    await expect(settled(closed)).resolves.toBe(DESTROYED)
  })
})

describe('vfm.toggle() promises', () => {
  it('settles vfm.open() when beforeOpen stops it', async () => {
    const { vfm } = mountApp(() => h(VueFinalModal, { modalId: 'stopped', focusTrap: false, onBeforeOpen: stop }))
    await nextTick()

    await expect(settled(vfm.open('stopped'))).resolves.toBe(OPEN_STOPPED)
  })

  it('settles vfm.close() when beforeClose stops it', async () => {
    const { vfm } = mountApp(() => h(VueFinalModal, { modalId: 'kept', focusTrap: false, onBeforeClose: stop }))
    await nextTick()

    await expect(settled(vfm.open('kept'))).resolves.toBe('opened')
    await expect(settled(vfm.close('kept'))).resolves.toBe(CLOSE_STOPPED)
  })

  it('finishes closeAll() when beforeClose stops one of the modals', async () => {
    const { vfm } = mountApp(() => [
      h(VueFinalModal, { modalId: 'kept', focusTrap: false, onBeforeClose: stop }),
      h(VueFinalModal, { modalId: 'closed', focusTrap: false }),
    ] as unknown as VNode)
    await nextTick()
    await Promise.all([vfm.open('kept'), vfm.open('closed')])

    await expect(settled(vfm.closeAll())).resolves.toEqual([
      { status: 'fulfilled', value: CLOSE_STOPPED },
      { status: 'fulfilled', value: 'closed' },
    ])
  })

  it('resolves vfm.open() right away for a modal that is already open', async () => {
    const { vfm } = mountApp(() => h(VueFinalModal, { modalId: 'open', focusTrap: false }))
    await nextTick()

    await expect(settled(vfm.open('open'))).resolves.toBe('opened')
    await expect(settled(vfm.open('open'))).resolves.toBe(ALREADY_OPENED)
  })

  it('settles vfm.open() when the modal unmounts before it finishes opening', async () => {
    const { app, vfm } = mountApp(() => h(VueFinalModal, { modalId: 'gone', focusTrap: false }))
    await nextTick()

    const opened = vfm.open('gone')
    apps.splice(apps.indexOf(app), 1)
    app.unmount()
    await expect(settled(opened)).resolves.toBe(DESTROYED)
  })

  it('resolves vfm.close() right away for a modal that is already closed', async () => {
    const { vfm } = mountApp(() => h(VueFinalModal, { modalId: 'closed', focusTrap: false }))
    await nextTick()

    await expect(settled(vfm.close('closed'))).resolves.toBe(ALREADY_CLOSED)
  })
})
