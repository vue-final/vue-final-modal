// @vitest-environment jsdom
import type { Component, VNode } from 'vue'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { createApp, h, nextTick, ref, watch } from 'vue'
import { createVfm, ModalsContainer, useModal, VueFinalDialog, VueFinalModal } from '../index'
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

  it('resolves already-opened and already-closed when nothing changes', async () => {
    mountApp()
    const modal = useModal({ component, attrs })

    await expect(settled(modal.close())).resolves.toBe('already-closed')
    await settled(modal.open())
    await expect(settled(modal.open())).resolves.toBe('already-opened')
  })

  it('resolves stopped when beforeOpen stops it, and drops the modal', async () => {
    const vfm = mountApp()
    const modal = useModal({ component, attrs: { ...attrs, onBeforeOpen: stop } })

    await expect(settled(modal.open())).resolves.toBe('stopped')
    await nextTick()
    expect(vfm.modals).toHaveLength(0)
  })

  it('resolves stopped when beforeClose stops it, and keeps the modal open', async () => {
    const vfm = mountApp()
    const modal = useModal({ component, attrs: { ...attrs, onBeforeClose: stop } })
    await settled(modal.open())

    await expect(settled(modal.close())).resolves.toBe('stopped')
    expect(vfm.openedModals).toHaveLength(1)
  })

  it('bounces v-model back when beforeOpen stops it', async () => {
    const updates: boolean[] = []
    mountApp(() => h(component, { ...attrs, 'modelValue': true, 'onBeforeOpen': stop, 'onUpdate:modelValue': (value: boolean) => updates.push(value) }))

    await expect.poll(() => updates).toEqual([false])
  })

  it('resolves toggled-again when another toggle overtakes a pending one', async () => {
    const vfm = mountApp(() => h(component, { ...attrs, modalId: 'contract' }))
    await nextTick()

    const opened = vfm.open('contract')
    const closed = vfm.close('contract')
    await expect(settled(opened)).resolves.toBe('toggled-again')
    await expect(settled(closed)).resolves.toBe('closed')
  })

  it('resolves destroyed when the modal is destroyed before it finishes opening', async () => {
    mountApp()
    const modal = useModal({ component, attrs })

    const opened = modal.open()
    modal.destroy()
    await expect(settled(opened)).resolves.toBe('destroyed')
  })

  it('resolves destroyed when the modal unmounts before vfm.open() finishes', async () => {
    const shown = ref(true)
    const vfm = mountApp(() => shown.value ? h(component, { ...attrs, modalId: 'contract' }) : undefined)
    await nextTick()

    const opened = vfm.open('contract')
    shown.value = false
    await expect(settled(opened)).resolves.toBe('destroyed')
  })

  it('is closed by closeAll()', async () => {
    const vfm = mountApp(() => h(component, { ...attrs, modalId: 'contract', modelValue: true }))

    await expect.poll(() => vfm.openedModals.length).toBe(1)
    await expect(settled(vfm.closeAll())).resolves.toEqual([{ status: 'fulfilled', value: 'closed' }])
  })

  it('joins an open() called while the modal is opening, and a close() called while it is closing', async () => {
    mountApp()
    const events: string[] = []
    const modal = useModal({ component, attrs: { ...attrs, onOpened: () => events.push('opened'), onClosed: () => events.push('closed') } })

    const opened = [modal.open(), modal.open()]
    await expect(settled(Promise.all(opened))).resolves.toEqual(['opened', 'opened'])
    const closed = [modal.close(), modal.close()]
    await expect(settled(Promise.all(closed))).resolves.toEqual(['closed', 'closed'])
    expect(events).toEqual(['opened', 'closed'])
  })

  it('joins a vfm.open() called while the modal is opening', async () => {
    const vfm = mountApp(() => h(component, { ...attrs, modalId: 'contract' }))
    await nextTick()

    const opened = [vfm.open('contract'), vfm.open('contract')]
    await expect(settled(Promise.all(opened))).resolves.toEqual(['opened', 'opened'])
  })

  it('opens once for open(), close() and open() called together, and drops the close()', async () => {
    mountApp()
    const modal = useModal({ component, attrs })

    const results = [modal.open(), modal.close(), modal.open()]
    await expect(settled(Promise.all(results))).resolves.toEqual(['opened', 'toggled-again', 'opened'])
    expect(modal.status.value).toBe('opened')
  })

  it('reports its status through useModal() and vfm.get()', async () => {
    const vfm = mountApp()
    const modal = useModal({ component, attrs: { ...attrs, modalId: 'status' } })
    const statuses: string[] = []
    watch(modal.status, status => statuses.push(status), { flush: 'sync' })
    expect(modal.status.value).toBe('closed')

    await settled(modal.open())
    expect(vfm.get('status')?.value.status.value).toBe('opened')
    await settled(modal.close())
    expect(statuses).toEqual(['opening', 'opened', 'closing', 'closed'])
  })

  it('never leaves closed when beforeOpen stops it, nor opened when beforeClose stops it', async () => {
    mountApp()
    const modal = useModal({ component, attrs: { ...attrs, onBeforeOpen: stop } })
    const statuses: string[] = []
    watch(modal.status, status => statuses.push(status), { flush: 'sync' })
    await settled(modal.open())
    expect(statuses).toEqual([])
    expect(modal.status.value).toBe('closed')

    const kept = useModal({ component, attrs: { ...attrs, onBeforeClose: stop } })
    await settled(kept.open())
    const keptStatuses: string[] = []
    watch(kept.status, status => keptStatuses.push(status), { flush: 'sync' })
    await settled(kept.close())
    expect(keptStatuses).toEqual([])
    expect(kept.status.value).toBe('opened')
  })

  it('is closed once destroyed', async () => {
    mountApp()
    const modal = useModal({ component, attrs })
    modal.open()

    modal.destroy()
    expect(modal.status.value).toBe('closed')
  })
})
