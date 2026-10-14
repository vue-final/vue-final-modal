// @vitest-environment jsdom
import type { Component, VNode } from 'vue'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h } from 'vue'
import { createVfm, ModalsContainer, useModal, useModalContext, VueFinalDialog, VueFinalModal } from '../index'
import { polyfillDialog } from './dialog.fixture'

beforeAll(polyfillDialog)

const apps: { unmount: () => void }[] = []

afterEach(() => {
  apps.splice(0).forEach(app => app.unmount())
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

function mountApp() {
  const el = document.createElement('div')
  document.body.append(el)
  const app = createApp({ render: () => h(ModalsContainer) })
  app.use(createVfm()).mount(el)
  apps.push(app)
}

interface SlotProps { titleId: string, descriptionId: string }

/** Rendered in place and open from the start, with a default slot that can use the slot props. Settles a task after it opened. */
async function mountOpen(component: Component, attrs: Record<string, unknown>, slot: (props: SlotProps) => VNode[]) {
  const el = document.createElement('div')
  document.body.append(el)
  const opened = new Promise((resolve) => {
    const app = createApp({ render: () => h(component, { modelValue: true, onOpened: resolve, ...attrs }, { default: slot }) })
    app.use(createVfm()).mount(el)
    apps.push(app)
  })
  await opened
  await new Promise(resolve => setTimeout(resolve))
}

async function openModal(attrs: Record<string, unknown> = {}, component: Component = VueFinalModal) {
  mountApp()
  const modal = useModal({ component, attrs: { focusTrap: false, ...attrs } })
  await modal.open()
  return modal
}

describe('the role of <VueFinalModal>', () => {
  it('is a modal dialog by default', async () => {
    await openModal()
    const root = document.querySelector('.vfm')!
    expect(root.getAttribute('role')).toBe('dialog')
    expect(root.getAttribute('aria-modal')).toBe('true')
  })

  it('can be an alertdialog', async () => {
    await openModal({ role: 'alertdialog' })
    const root = document.querySelector('.vfm')!
    expect(root.getAttribute('role')).toBe('alertdialog')
    expect(root.getAttribute('aria-modal')).toBe('true')
  })

  it('is not modal with an interactive background', async () => {
    await openModal({ background: 'interactive' })
    const root = document.querySelector('.vfm')!
    expect(root.getAttribute('role')).toBe('dialog')
    expect(root.hasAttribute('aria-modal')).toBe(false)
  })
})

describe.each([
  { name: 'VueFinalModal', component: VueFinalModal, attrs: { teleportTo: false, focusTrap: false }, selector: '.vfm' },
  { name: 'VueFinalDialog', component: VueFinalDialog, attrs: {}, selector: 'dialog' },
])('the title and description of <$name>', ({ component, attrs, selector }) => {
  it('are linked when the slot renders elements with their ids', async () => {
    await mountOpen(component, attrs, ({ titleId, descriptionId }) => [
      h('h2', { id: titleId }, 'Title'),
      h('p', { id: descriptionId }, 'Description'),
    ])
    const titleId = document.querySelector('h2')!.id
    const descriptionId = document.querySelector('p')!.id
    expect(titleId).not.toBe('')
    expect(descriptionId).not.toBe('')
    const dialog = document.querySelector(selector)!
    expect(dialog.getAttribute('aria-labelledby')).toBe(titleId)
    expect(dialog.getAttribute('aria-describedby')).toBe(descriptionId)
  })

  it('are not linked when the slot renders no element with their ids', async () => {
    await mountOpen(component, attrs, ({ titleId }) => [h('h2', { id: titleId }, 'Title')])
    const dialog = document.querySelector(selector)!
    expect(dialog.hasAttribute('aria-labelledby')).toBe(true)
    expect(dialog.hasAttribute('aria-describedby')).toBe(false)
  })

  it('give way to the aria-labelledby and aria-describedby passed', async () => {
    await mountOpen(component, { ...attrs, 'aria-labelledby': 'my-title', 'aria-describedby': 'my-description' }, ({ titleId, descriptionId }) => [
      h('h2', { id: titleId }, 'Title'),
      h('p', { id: descriptionId }, 'Description'),
    ])
    const dialog = document.querySelector(selector)!
    expect(dialog.getAttribute('aria-labelledby')).toBe('my-title')
    expect(dialog.getAttribute('aria-describedby')).toBe('my-description')
  })
})

describe.each([
  { name: 'VueFinalModal', component: VueFinalModal, attrs: { teleportTo: false, focusTrap: false } },
  { name: 'VueFinalDialog', component: VueFinalDialog, attrs: {} },
])('the warnings of <$name>', ({ name, component, attrs }) => {
  function warnings() {
    return vi.spyOn(console, 'warn').mockImplementation(() => {})
  }

  it('warn when it opens without a name', async () => {
    const warn = warnings()
    await mountOpen(component, attrs, () => [h('p', 'Content')])
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn).toHaveBeenCalledWith(expect.stringContaining(`<${name}> has no accessible name`))
  })

  it('warn when its aria-labelledby points at no element', async () => {
    const warn = warnings()
    await mountOpen(component, { ...attrs, 'aria-labelledby': 'missing' }, () => [h('p', 'Content')])
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('has no accessible name'))
  })

  it.each([
    { label: 'a title rendered with titleId', extra: {}, slot: ({ titleId }: SlotProps) => [h('h2', { id: titleId }, 'Title')] },
    { label: 'an aria-label', extra: { 'aria-label': 'Title' }, slot: () => [h('p', 'Content')] },
    { label: 'an aria-labelledby that points at an element', extra: { 'aria-labelledby': 'my-title' }, slot: () => [h('h2', { id: 'my-title' }, 'Title')] },
  ])('stay quiet with $label', async ({ extra, slot }) => {
    const warn = warnings()
    await mountOpen(component, { ...attrs, ...extra }, slot)
    expect(warn).not.toHaveBeenCalled()
  })

  it('warn when an alertdialog opens without a description', async () => {
    const warn = warnings()
    await mountOpen(component, { ...attrs, role: 'alertdialog' }, ({ titleId }) => [h('h2', { id: titleId }, 'Title')])
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn).toHaveBeenCalledWith(expect.stringContaining(`<${name}> with role="alertdialog" has no description`))
  })

  it('stay quiet for an alertdialog with a description rendered with descriptionId', async () => {
    const warn = warnings()
    await mountOpen(component, { ...attrs, role: 'alertdialog' }, ({ titleId, descriptionId }) => [
      h('h2', { id: titleId }, 'Title'),
      h('p', { id: descriptionId }, 'Description'),
    ])
    expect(warn).not.toHaveBeenCalled()
  })
})

describe.each([
  { name: 'VueFinalModal', component: VueFinalModal, attrs: { focusTrap: false }, selector: '.vfm' },
  { name: 'VueFinalDialog', component: VueFinalDialog, attrs: {}, selector: 'dialog' },
])('useModalContext() in <$name>', ({ component, attrs, selector }) => {
  it('gives a component in a useModal() slot the close, titleId and descriptionId of its modal', async () => {
    const Content = defineComponent(() => {
      const modal = useModalContext()
      return () => [
        h('h2', { id: modal?.titleId }, 'Title'),
        h('p', { id: modal?.descriptionId }, 'Description'),
        h('button', { class: 'close', onClick: () => modal?.close() }, 'Close'),
      ]
    })
    mountApp()
    const modal = useModal({ component, attrs, slots: { default: Content } })
    await modal.open()
    await new Promise(resolve => setTimeout(resolve))

    const dialog = document.querySelector(selector)!
    const titleId = document.querySelector('h2')!.id
    const descriptionId = document.querySelector('p')!.id
    expect(titleId).not.toBe('')
    expect(descriptionId).not.toBe('')
    expect(dialog.getAttribute('aria-labelledby')).toBe(titleId)
    expect(dialog.getAttribute('aria-describedby')).toBe(descriptionId)

    document.querySelector<HTMLButtonElement>('.close')!.click()
    await expect.poll(() => document.querySelector(selector)).toBeNull()
  })
})

it('useModalContext() is undefined outside a modal', () => {
  let context: unknown = 'not read'
  const app = createApp(defineComponent(() => {
    context = useModalContext()
    return () => h('p')
  }))
  app.mount(document.body.appendChild(document.createElement('div')))
  apps.push(app)
  expect(context).toBeUndefined()
})
