// @vitest-environment jsdom
import type { Component, VNode } from 'vue'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { createApp, createSSRApp, h, nextTick, ref } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createVfm, ModalsContainer, useModal, VueFinalDialog } from '../index'
import { ALREADY_CLOSED, ALREADY_OPENED, CLOSE_STOPPED, DESTROYED, OPEN_STOPPED, TOGGLED_AGAIN } from '../utils'
import { polyfillDialog, pressEsc } from './dialog.fixture'

/** A transition running on the dialog, which getAnimations() reports until it is finished. */
let running: { finished: Promise<void>, finish: () => void } | undefined

function startTransition() {
  let finish = () => {}
  const finished = new Promise<void>(resolve => finish = resolve)
  running = { finished, finish: () => {
    running = undefined
    finish()
  } }
}

beforeAll(() => {
  polyfillDialog()
  Object.assign(HTMLDialogElement.prototype, {
    getAnimations(this: HTMLDialogElement) {
      if (!running)
        return []
      return [{ effect: { target: this, getComputedTiming: () => ({ endTime: 300 }) }, finished: running.finished }]
    },
  })
})

const apps: { unmount: () => void }[] = []

function mountApp(render: () => VNode | VNode[] | undefined = () => undefined) {
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

function dialog() {
  return document.querySelector('dialog')
}

const stop = (event: { stop: () => void }) => event.stop()

afterEach(() => {
  running?.finish()
  apps.splice(0).forEach(app => app.unmount())
  document.body.innerHTML = ''
  document.body.removeAttribute('style')
})

describe('vueFinalDialog with useModal()', () => {
  it('settles open() once the dialog is shown as a modal, and close() once it is closed and dropped', async () => {
    mountApp()
    const modal = useModal({ component: VueFinalDialog, slots: { default: 'Hello' } })

    await expect(settled(modal.open())).resolves.toBe('opened')
    expect(dialog()?.open).toBe(true)
    expect(dialog()?.dataset.modal).toBe('true')
    expect(dialog()?.textContent).toBe('Hello')

    await expect(settled(modal.close())).resolves.toBe('closed')
    await nextTick()
    expect(dialog()).toBeNull()
  })

  it('settles open() and close() once the transitions of the dialog finish', async () => {
    mountApp()
    const modal = useModal({ component: VueFinalDialog })

    startTransition()
    const opened = modal.open()
    await expect(settled(opened)).resolves.toBe('still pending')
    running!.finish()
    await expect(settled(opened)).resolves.toBe('opened')

    startTransition()
    const closed = modal.close()
    await expect(settled(closed)).resolves.toBe('still pending')
    expect(dialog()).not.toBeNull()
    running!.finish()
    await expect(settled(closed)).resolves.toBe('closed')
  })

  it('shows a non-modal dialog with modal false', async () => {
    mountApp()
    const modal = useModal({ component: VueFinalDialog, attrs: { modal: false } })

    await expect(settled(modal.open())).resolves.toBe('opened')
    expect(dialog()?.dataset.modal).toBe('false')
  })

  it('passes closedby through to the dialog', async () => {
    mountApp()
    const modal = useModal({ component: VueFinalDialog, attrs: { closedby: 'none' } })

    await settled(modal.open())
    expect(dialog()?.getAttribute('closedby')).toBe('none')
  })

  it('drops the dialog closed by Esc, and opens it again', async () => {
    mountApp()
    const updates: boolean[] = []
    let closed = 0
    const modal = useModal({
      component: VueFinalDialog,
      attrs: { 'onUpdate:modelValue': (value: boolean) => updates.push(value), 'onClosed': () => closed++ },
    })
    await settled(modal.open())

    pressEsc()
    await expect.poll(() => dialog()).toBeNull()
    expect(updates).toEqual([false])
    expect(closed).toBe(1)

    await expect(settled(modal.open())).resolves.toBe('opened')
    expect(dialog()?.open).toBe(true)
  })

  it('keeps the dialog open on Esc when a cancel listener prevents it, without asking beforeClose', async () => {
    mountApp()
    let asked = 0
    const modal = useModal({
      component: VueFinalDialog,
      attrs: { onCancel: (event: Event) => event.preventDefault(), onBeforeClose: () => asked++ },
    })
    await settled(modal.open())

    pressEsc()
    await new Promise(resolve => setTimeout(resolve, 10))
    expect(dialog()?.open).toBe(true)
    expect(asked).toBe(0)
  })

  it('drops the dialog a form with method dialog closed, and hands the native close event its returnValue', async () => {
    mountApp()
    const returnValues: string[] = []
    const modal = useModal({
      component: VueFinalDialog,
      attrs: { onClose: (event: Event) => returnValues.push((event.target as HTMLDialogElement).returnValue) },
    })
    await settled(modal.open())

    dialog()!.close('confirmed')
    await expect.poll(() => dialog()).toBeNull()
    expect(returnValues).toEqual(['confirmed'])
  })
})

describe('vueFinalDialog promises', () => {
  it('resolves open() with ALREADY_OPENED for a dialog that is already open', async () => {
    mountApp()
    const modal = useModal({ component: VueFinalDialog })
    await settled(modal.open())

    await expect(settled(modal.open())).resolves.toBe(ALREADY_OPENED)
  })

  it('resolves close() with ALREADY_CLOSED for a dialog that is already closed', async () => {
    mountApp()
    const modal = useModal({ component: VueFinalDialog })

    await expect(settled(modal.close())).resolves.toBe(ALREADY_CLOSED)
  })

  it('settles open() with OPEN_STOPPED when beforeOpen stops it, and drops the dialog', async () => {
    const { vfm } = mountApp()
    const modal = useModal({ component: VueFinalDialog, attrs: { onBeforeOpen: stop } })

    await expect(settled(modal.open())).resolves.toBe(OPEN_STOPPED)
    await nextTick()
    expect(dialog()).toBeNull()
    expect(vfm.modals).toHaveLength(0)
  })

  it('settles close() with CLOSE_STOPPED when beforeClose stops it, and keeps the dialog open', async () => {
    mountApp()
    const modal = useModal({ component: VueFinalDialog, attrs: { onBeforeClose: stop } })
    await expect(settled(modal.open())).resolves.toBe('opened')

    await expect(settled(modal.close())).resolves.toBe(CLOSE_STOPPED)
    expect(dialog()?.open).toBe(true)
  })

  it('keeps the dialog open on Esc when beforeClose stops it', async () => {
    mountApp()
    const modal = useModal({ component: VueFinalDialog, attrs: { onBeforeClose: stop } })
    await settled(modal.open())

    pressEsc()
    await new Promise(resolve => setTimeout(resolve, 10))
    expect(dialog()?.open).toBe(true)
  })

  it('settles open() with TOGGLED_AGAIN and a pending close() with closed when Esc closes the dialog while it opens', async () => {
    mountApp()
    const modal = useModal({ component: VueFinalDialog })
    startTransition()
    const opened = modal.open()
    await expect.poll(() => dialog()?.open).toBe(true)
    const closed = modal.close()

    pressEsc()
    running!.finish()
    await expect(settled(opened)).resolves.toBe(TOGGLED_AGAIN)
    await expect(settled(closed)).resolves.toBe('closed')
    await expect.poll(() => dialog()).toBeNull()
  })

  it('settles open() with DESTROYED when the dialog is destroyed before it finishes opening', async () => {
    mountApp()
    const modal = useModal({ component: VueFinalDialog })
    startTransition()

    const opened = modal.open()
    await expect.poll(() => dialog()?.open).toBe(true)
    modal.destroy()
    await expect(settled(opened)).resolves.toBe(DESTROYED)
  })

  it('settles close() with DESTROYED when the dialog is destroyed before it finishes closing', async () => {
    mountApp()
    const modal = useModal({ component: VueFinalDialog })
    await settled(modal.open())
    startTransition()

    const closed = modal.close()
    modal.destroy()
    await expect(settled(closed)).resolves.toBe(DESTROYED)
  })
})

describe('vueFinalDialog with vfm', () => {
  it('opens and closes a dialog with modalId, and closeAll() closes it', async () => {
    const { vfm } = mountApp(() => h(VueFinalDialog, { modalId: 'native' }))
    await nextTick()

    await expect(settled(vfm.open('native'))).resolves.toBe('opened')
    expect(dialog()?.open).toBe(true)
    await expect(settled(vfm.open('native'))).resolves.toBe(ALREADY_OPENED)
    await expect(settled(vfm.closeAll())).resolves.toEqual([{ status: 'fulfilled', value: 'closed' }])
    expect(dialog()?.open).toBe(false)
  })

  it('settles vfm.open() with OPEN_STOPPED and vfm.close() with CLOSE_STOPPED', async () => {
    const stopOpen = ref(true)
    const { vfm } = mountApp(() => h(VueFinalDialog, { modalId: 'stopped', onBeforeOpen: (event: { stop: () => void }) => stopOpen.value && event.stop(), onBeforeClose: stop }))
    await nextTick()

    await expect(settled(vfm.open('stopped'))).resolves.toBe(OPEN_STOPPED)
    stopOpen.value = false
    await expect(settled(vfm.open('stopped'))).resolves.toBe('opened')
    await expect(settled(vfm.close('stopped'))).resolves.toBe(CLOSE_STOPPED)
  })

  it('settles vfm.open() with TOGGLED_AGAIN when vfm.close() overtakes it', async () => {
    const { vfm } = mountApp(() => h(VueFinalDialog, { modalId: 'toggled' }))
    await nextTick()
    startTransition()

    const opened = vfm.open('toggled')
    const closed = vfm.close('toggled')
    running!.finish()
    await expect(settled(opened)).resolves.toBe(TOGGLED_AGAIN)
    await expect(settled(closed)).resolves.toBe('closed')
  })

  it('settles vfm.open() with DESTROYED when the dialog unmounts before it finishes opening', async () => {
    const { app, vfm } = mountApp(() => h(VueFinalDialog, { modalId: 'gone' }))
    await nextTick()
    startTransition()

    const opened = vfm.open('gone')
    apps.splice(apps.indexOf(app), 1)
    app.unmount()
    await expect(settled(opened)).resolves.toBe(DESTROYED)
  })
})

describe('vueFinalDialog with v-model', () => {
  function mountDialog(props: Record<string, unknown> = {}) {
    const show = ref(true)
    const events: string[] = []
    mountApp(() => h(VueFinalDialog, {
      'modelValue': show.value,
      'onUpdate:modelValue': (value: boolean) => {
        events.push(`update:${value}`)
        show.value = value
      },
      'onOpened': () => events.push('opened'),
      'onClosed': () => events.push('closed'),
      ...props,
    }))
    return { show, events }
  }

  it('shows the dialog while modelValue is true', async () => {
    const { show, events } = mountDialog()
    await expect.poll(() => events).toEqual(['opened'])
    expect(dialog()?.open).toBe(true)

    show.value = false
    await expect.poll(() => events).toEqual(['opened', 'closed'])
    expect(dialog()?.open).toBe(false)
  })

  it('writes back modelValue when Esc closes the dialog', async () => {
    const { show, events } = mountDialog()
    await expect.poll(() => events).toEqual(['opened'])

    pressEsc()
    await expect.poll(() => events).toEqual(['opened', 'update:false', 'closed'])
    expect(show.value).toBe(false)
  })

  it('bounces modelValue back when beforeOpen stops it', async () => {
    const { show, events } = mountDialog({ onBeforeOpen: stop })

    await expect.poll(() => events).toEqual(['update:false'])
    expect(show.value).toBe(false)
    expect(dialog()?.open).toBe(false)
  })

  it('bounces modelValue back when beforeClose stops it', async () => {
    const { show, events } = mountDialog({ onBeforeClose: stop })
    await expect.poll(() => events).toEqual(['opened'])

    show.value = false
    await expect.poll(() => events).toEqual(['opened', 'update:true'])
    expect(show.value).toBe(true)
    expect(dialog()?.open).toBe(true)
  })

  it('opens a dialog that was already shown natively instead of throwing', async () => {
    const show = ref(false)
    const opened: string[] = []
    mountApp(() => h(VueFinalDialog, { modelValue: show.value, onOpened: () => opened.push('opened') }))
    await nextTick()
    dialog()!.showModal()

    show.value = true
    await expect.poll(() => opened).toEqual(['opened'])
    expect(dialog()?.open).toBe(true)
  })

  it('ignores the close event of a dialog opened again before it fired', async () => {
    const { show, events } = mountDialog()
    await expect.poll(() => events).toEqual(['opened'])

    show.value = false
    await nextTick()
    show.value = true
    await new Promise(resolve => setTimeout(resolve, 10))
    expect(dialog()?.open).toBe(true)
    expect(show.value).toBe(true)
    expect(events).not.toContain('update:false')
  })
})

describe('props: lockScroll', () => {
  it('leaves the page scroll alone by default', async () => {
    mountApp()
    const modal = useModal({ component: VueFinalDialog })

    await settled(modal.open())
    expect(document.body.style.overflowY).toBe('')
  })

  it('locks the page scroll while the dialog is open', async () => {
    mountApp()
    const modal = useModal({ component: VueFinalDialog, attrs: { lockScroll: true } })

    await settled(modal.open())
    expect(document.body.style.overflowY).toBe('hidden')

    await settled(modal.close())
    expect(document.body.style.overflowY).toBe('')
  })

  it('unlocks the page scroll when Esc closes the dialog', async () => {
    mountApp()
    const modal = useModal({ component: VueFinalDialog, attrs: { lockScroll: true } })
    await settled(modal.open())

    pressEsc()
    await expect.poll(() => document.body.style.overflowY).toBe('')
  })

  it('unlocks the page scroll when an open dialog unmounts', async () => {
    mountApp()
    const modal = useModal({ component: VueFinalDialog, attrs: { lockScroll: true } })
    await settled(modal.open())

    modal.destroy()
    await nextTick()
    expect(dialog()).toBeNull()
    expect(document.body.style.overflowY).toBe('')
  })
})

describe('vueFinalDialog on the server', () => {
  it('resolves open() right away and renders the dialog closed', async () => {
    let result: string | undefined
    const Page: Component = {
      async setup() {
        result = await useModal({ component: VueFinalDialog, slots: { default: 'From the server' } }).open()
        return () => h('p', 'page')
      },
    }
    const app = createSSRApp({ render: () => [h(Page), h(ModalsContainer)] })
    app.use(createVfm())

    const html = await renderToString(app)
    expect(result).toBe('opened')
    expect(html).toContain('<dialog><!--[--><div>From the server</div><!--]--></dialog>')
  })
})
