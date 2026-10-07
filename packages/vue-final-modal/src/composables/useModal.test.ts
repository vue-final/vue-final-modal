// @vitest-environment jsdom
import type { VNode } from 'vue'
import { createApp, h, nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import { ModalsContainer, VueFinalModal, createVfm, useModal } from '../index'
import { CLOSE_STOPPED, OPEN_STOPPED } from '../utils'

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
  return Promise.race([promise, new Promise(resolve => setTimeout(resolve, 100, 'still pending'))])
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
})
