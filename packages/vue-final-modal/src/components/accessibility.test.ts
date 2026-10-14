// @vitest-environment jsdom
import type { Component } from 'vue'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { createApp, h } from 'vue'
import { createVfm, ModalsContainer, useModal, VueFinalModal } from '../index'
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
})
