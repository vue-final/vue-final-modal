// @vitest-environment jsdom
import type { Component, VNode } from 'vue'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { createApp, h } from 'vue'
import { createVfm, ModalsContainer, useModal, VueFinalDialog, VueFinalModal } from '../index'
import { polyfillDialog } from './dialog.fixture'

beforeAll(polyfillDialog)

const apps: { unmount: () => void }[] = []

afterEach(() => {
  apps.splice(0).forEach(app => app.unmount())
  document.body.innerHTML = ''
})

function mountApp() {
  const el = document.createElement('div')
  document.body.append(el)
  const app = createApp({ render: () => h(ModalsContainer) })
  app.use(createVfm()).mount(el)
  apps.push(app)
}

interface SlotProps { titleId: string, descriptionId: string }

/** Rendered in place and open from the start, with a default slot that can use the slot props. */
function mountOpen(component: Component, attrs: Record<string, unknown>, slot: (props: SlotProps) => VNode[]) {
  const el = document.createElement('div')
  document.body.append(el)
  const app = createApp({ render: () => h(component, { modelValue: true, ...attrs }, { default: slot }) })
  app.use(createVfm()).mount(el)
  apps.push(app)
  return new Promise(resolve => setTimeout(resolve))
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
