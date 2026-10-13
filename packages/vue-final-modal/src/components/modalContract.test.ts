// @vitest-environment jsdom
import type { Component, VNode } from 'vue'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { createApp, h, nextTick, ref } from 'vue'
import { createVfm, ModalsContainer, useModal, VueFinalDialog, VueFinalModal } from '../index'
import { ALREADY_CLOSED, ALREADY_OPENED, CLOSE_STOPPED, DESTROYED, OPEN_STOPPED, TOGGLED_AGAIN } from '../utils'
import { polyfillDialog } from './dialog.fixture'

beforeAll(polyfillDialog)

const apps: { unmount: () => void }[] = []

afterEach(() => {
  apps.splice(0).forEach(app => app.unmount())
  document.body.innerHTML = ''
})

function mountApp(render: () => VNode | undefined = () => undefined) {
  const el = document.createElement('div')
  document.body.append(el)
  const vfm = createVfm()
  const app = createApp({ render: () => [render(), h(ModalsContainer)] })
  app.use(vfm).mount(el)
  apps.push(app)
  return vfm
}

function settled<T>(promise: Promise<T> | undefined) {
  return Promise.race([promise, new Promise(resolve => setTimeout(resolve, 1000, 'still pending'))])
}

const stop = (event: { stop: () => void }) => event.stop()

describe.each([
  { name: 'VueFinalModal', component: VueFinalModal as Component, attrs: { focusTrap: false } },
  { name: 'VueFinalDialog', component: VueFinalDialog as Component, attrs: {} },
])('the promise contract of $name', ({ component, attrs }) => {
  it('resolves opened and closed, and drops the modal once closed', async () => {
    const vfm = mountApp()
    const modal = useModal({ component, attrs })

    await expect(settled(modal.open())).resolves.toBe('opened')
    expect(vfm.openedModals).toHaveLength(1)
    await expect(settled(modal.close())).resolves.toBe('closed')
    await nextTick()
    expect(vfm.modals).toHaveLength(0)
  })

  it('resolves ALREADY_OPENED and ALREADY_CLOSED when nothing changes', async () => {
    mountApp()
    const modal = useModal({ component, attrs })

    await expect(settled(modal.close())).resolves.toBe(ALREADY_CLOSED)
    await settled(modal.open())
    await expect(settled(modal.open())).resolves.toBe(ALREADY_OPENED)
  })

  it('resolves OPEN_STOPPED when beforeOpen stops it, and drops the modal', async () => {
    const vfm = mountApp()
    const modal = useModal({ component, attrs: { ...attrs, onBeforeOpen: stop } })

    await expect(settled(modal.open())).resolves.toBe(OPEN_STOPPED)
    await nextTick()
    expect(vfm.modals).toHaveLength(0)
  })

  it('resolves CLOSE_STOPPED when beforeClose stops it, and keeps the modal open', async () => {
    const vfm = mountApp()
    const modal = useModal({ component, attrs: { ...attrs, onBeforeClose: stop } })
    await settled(modal.open())

    await expect(settled(modal.close())).resolves.toBe(CLOSE_STOPPED)
    expect(vfm.openedModals).toHaveLength(1)
  })

  it('bounces v-model back when beforeOpen stops it', async () => {
    const updates: boolean[] = []
    mountApp(() => h(component, { ...attrs, 'modelValue': true, 'onBeforeOpen': stop, 'onUpdate:modelValue': (value: boolean) => updates.push(value) }))

    await expect.poll(() => updates).toEqual([false])
  })

  it('resolves TOGGLED_AGAIN when another toggle overtakes a pending one', async () => {
    const vfm = mountApp(() => h(component, { ...attrs, modalId: 'contract' }))
    await nextTick()

    const opened = vfm.open('contract')
    const closed = vfm.close('contract')
    await expect(settled(opened)).resolves.toBe(TOGGLED_AGAIN)
    await expect(settled(closed)).resolves.toBe('closed')
  })

  it('resolves DESTROYED when the modal is destroyed before it finishes opening', async () => {
    mountApp()
    const modal = useModal({ component, attrs })

    const opened = modal.open()
    modal.destroy()
    await expect(settled(opened)).resolves.toBe(DESTROYED)
  })

  it('resolves DESTROYED when the modal unmounts before vfm.open() finishes', async () => {
    const shown = ref(true)
    const vfm = mountApp(() => shown.value ? h(component, { ...attrs, modalId: 'contract' }) : undefined)
    await nextTick()

    const opened = vfm.open('contract')
    shown.value = false
    await expect(settled(opened)).resolves.toBe(DESTROYED)
  })

  it('is closed by closeAll()', async () => {
    const vfm = mountApp(() => h(component, { ...attrs, modalId: 'contract', modelValue: true }))

    await expect.poll(() => vfm.openedModals.length).toBe(1)
    await expect(settled(vfm.closeAll())).resolves.toEqual([{ status: 'fulfilled', value: 'closed' }])
  })
})
