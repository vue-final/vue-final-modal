import type { Component } from 'vue'
import { describe, expect, it, onTestFinished, vi } from 'vitest'
import { createSSRApp, defineComponent, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createTemplateProvider } from './createTemplateProvider'

function renderRequest(TemplateProvider: Component, page: Component) {
  return renderToString(createSSRApp({
    render: () => h(TemplateProvider, null, { default: () => h(page) }),
  }))
}

describe('server-side rendering', () => {
  it('renders a template shown during setup into the server HTML', async () => {
    const { TemplateProvider, useTemplate } = createTemplateProvider()
    const Page = defineComponent({
      setup() {
        useTemplate({ component: () => h('dialog', 'shown in setup') }, { showByDefault: true })
        return () => h('p', 'page')
      },
    })

    expect(await renderRequest(TemplateProvider, Page)).toContain('<dialog>shown in setup</dialog>')
  })

  it('renders a template shown by the component that renders TemplateProvider', async () => {
    const { TemplateProvider, useTemplate } = createTemplateProvider()
    const App = defineComponent({
      setup() {
        useTemplate({ component: () => h('dialog', 'shown by app') }).show()
        return () => h(TemplateProvider, null, { default: () => h('p', 'page') })
      },
    })

    expect(await renderToString(createSSRApp(App))).toContain('<dialog>shown by app</dialog>')
  })

  it('keeps concurrent renders isolated from each other', async () => {
    const { TemplateProvider, useTemplate } = createTemplateProvider()
    const pageShowing = (text: string) => defineComponent({
      async setup() {
        useTemplate({ component: () => h('dialog', text) }).show()
        await new Promise(resolve => setTimeout(resolve))
        return () => h('p', 'page')
      },
    })

    const [first, second] = await Promise.all([
      renderRequest(TemplateProvider, pageShowing('first request')),
      renderRequest(TemplateProvider, pageShowing('second request')),
    ])

    expect(first).toContain('first request')
    expect(first).not.toContain('second request')
    expect(second).toContain('second request')
    expect(second).not.toContain('first request')
  })

  it('does not leak a template shown after an await into the next request', async () => {
    const { TemplateProvider, useTemplate } = createTemplateProvider()
    const AsyncPage = defineComponent({
      async setup() {
        const { show } = useTemplate({ component: () => h('dialog', 'leaked') })
        await Promise.resolve()
        show()
        return () => h('p', 'async page')
      },
    })

    await renderRequest(TemplateProvider, AsyncPage)

    expect(await renderRequest(TemplateProvider, () => h('p', 'next request'))).not.toContain('leaked')
  })

  it('does not leak a template between renders of a reused app', async () => {
    /** Vue itself warns when renderToString provides a new SSR context to an app it already rendered. */
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    onTestFinished(() => warn.mockRestore())
    const { TemplateProvider, useTemplate } = createTemplateProvider()
    let request = 0
    const AsyncPage = defineComponent({
      async setup() {
        const { show } = useTemplate({ component: () => h('dialog', `dialog of request ${++request}`) })
        await Promise.resolve()
        show()
        return () => h('p', 'async page')
      },
    })
    const app = createSSRApp({
      render: () => h(TemplateProvider, null, { default: () => h(AsyncPage) }),
    })

    await renderToString(app)

    expect(await renderToString(app)).not.toContain('dialog of request 1')
    expect(warn.mock.calls.every(([message]) => String(message).includes('Symbol(v-scx)'))).toBe(true)
  })

  it('ignores show() called outside any component on the server, with a warning', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    onTestFinished(() => warn.mockRestore())
    const { TemplateProvider, useTemplate } = createTemplateProvider()

    useTemplate({ component: () => h('dialog', 'leaked') }).show()

    expect(await renderRequest(TemplateProvider, () => h('p', 'page'))).not.toContain('leaked')
    expect(warn).toHaveBeenCalledOnce()
    expect(warn.mock.calls[0][0]).toContain('outside a component on the server')
  })

  it('reports that show() will be ignored outside any component on the server, without a warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    onTestFinished(() => warn.mockRestore())
    const { useTemplate } = createTemplateProvider()

    expect(useTemplate({ component: () => h('dialog') }).ignored).toBe(true)
    expect(warn).not.toHaveBeenCalled()
  })

  it('reports that show() renders during setup on the server', async () => {
    const { TemplateProvider, useTemplate } = createTemplateProvider()
    let ignored: boolean | undefined
    const Page = defineComponent({
      setup() {
        ignored = useTemplate({ component: () => h('dialog') }).ignored
        return () => h('p', 'page')
      },
    })

    await renderRequest(TemplateProvider, Page)

    expect(ignored).toBe(false)
  })
})
