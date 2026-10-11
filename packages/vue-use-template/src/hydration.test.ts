// @vitest-environment jsdom
import type { Component } from 'vue'
import { describe, expect, it, onTestFinished, vi } from 'vitest'
import { createSSRApp, defineAsyncComponent, defineComponent, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createTemplateProvider } from './createTemplateProvider'

function createApp(template: Component = () => h('dialog', 'shown in setup')) {
  const { TemplateProvider, useTemplate } = createTemplateProvider()
  const Page = defineComponent({
    setup() {
      useTemplate({ component: template }, { showByDefault: true })
      return () => h('p', 'page')
    },
  })
  return createSSRApp({
    render: () => h(TemplateProvider, null, { default: () => h(Page) }),
  })
}

/** One module per side, like the separate server and browser processes: after a server render, useTemplate() outside a component counts as running on the server. */
async function importFresh() {
  vi.resetModules()
  return import('./createTemplateProvider')
}

describe('hydration', () => {
  it('hydrates a server-rendered template without mismatches', async () => {
    const html = await renderToString(createApp())
    const container = document.createElement('div')
    container.innerHTML = html
    const warn = vi.spyOn(console, 'warn')
    const error = vi.spyOn(console, 'error')

    createApp().mount(container)
    await nextTick()

    expect(html).toContain('<dialog>shown in setup</dialog>')
    expect([...warn.mock.calls, ...error.mock.calls].flat().join('\n')).not.toMatch(/hydration/i)
    expect(container.innerHTML).toBe(html)
  })

  it('keeps a template shown outside any component out of hydration, then renders it', async () => {
    const page = (TemplateProvider: Component) => createSSRApp({
      render: () => h(TemplateProvider, null, { default: () => h('p', 'page') }),
    })
    const html = await renderToString(page((await importFresh()).createTemplateProvider().TemplateProvider))
    const { TemplateProvider, useTemplate } = (await importFresh()).createTemplateProvider()
    useTemplate({ component: () => h('dialog', 'shown outside a component') }).show()
    const container = document.body.appendChild(document.createElement('div'))
    onTestFinished(() => container.remove())
    container.innerHTML = html
    const warn = vi.spyOn(console, 'warn')
    const error = vi.spyOn(console, 'error')

    page(TemplateProvider).mount(container)
    const hydrated = container.innerHTML
    await nextTick()

    expect(hydrated).toBe(html)
    expect([...warn.mock.calls, ...error.mock.calls].flat().join('\n')).not.toMatch(/hydration/i)
    expect(container.innerHTML).toContain('<dialog>shown outside a component</dialog>')
  })

  it('hydrates a template shown outside any component through a state that renders it on the server too', async () => {
    const render = async () => {
      const { createProvider, createTemplateOutlet, createUseTemplate } = await importFresh()
      const provider = createProvider()
      const state = { install() {}, resolveProvider: () => provider }
      const Outlet = createTemplateOutlet(state)
      createUseTemplate(state)({ component: () => h('dialog', 'shown by a library') }).show()
      return createSSRApp({ render: () => h('main', [h('p', 'page'), h(Outlet)]) })
    }
    const html = await renderToString(await render())
    const app = await render()
    const container = document.createElement('div')
    container.innerHTML = html
    const warn = vi.spyOn(console, 'warn')
    const error = vi.spyOn(console, 'error')

    app.mount(container)
    const hydrated = container.innerHTML
    await nextTick()

    expect(html).toContain('<dialog>shown by a library</dialog>')
    expect(hydrated).toBe(html)
    expect([...warn.mock.calls, ...error.mock.calls].flat().join('\n')).not.toMatch(/hydration/i)
    expect(container.querySelectorAll('dialog')).toHaveLength(1)
  })

  it('hydrates a server-rendered async component template without mismatches', async () => {
    const AsyncDialog = () => defineAsyncComponent(async () => () => h('dialog', 'async dialog'))
    const html = await renderToString(createApp(AsyncDialog()))
    const container = document.createElement('div')
    container.innerHTML = html
    const warn = vi.spyOn(console, 'warn')
    const error = vi.spyOn(console, 'error')

    createApp(AsyncDialog()).mount(container)
    await new Promise(resolve => setTimeout(resolve))
    await nextTick()

    expect(html).toContain('<dialog>async dialog</dialog>')
    expect([...warn.mock.calls, ...error.mock.calls].flat().join('\n')).not.toMatch(/hydration/i)
    expect(container.innerHTML).toBe(html)
  })
})
