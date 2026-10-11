// @vitest-environment jsdom

import type { InjectionKey } from 'vue'
import { describe, expect, it, onTestFinished, vi } from 'vitest'
import { createSSRApp, defineComponent, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createInstanceResolver, isBrowser, markServer } from './createInstanceResolver'
import { createTemplateProvider } from './createTemplateProvider'

markServer()

describe('server-side rendering with window defined', () => {
  it('does not count as a browser once marked as a server', () => {
    expect(isBrowser()).toBe(false)
  })

  it('never falls back to the active instance outside a component', () => {
    const resolver = createInstanceResolver(Symbol('thing') as InjectionKey<string>)
    resolver.setActive('active')

    expect(resolver.resolve()).toBeUndefined()
  })

  it('ignores show() from a useTemplate() called in app.runWithContext() before the first render, with a warning', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    onTestFinished(() => warn.mockRestore())
    const { TemplateProvider, useTemplate } = createTemplateProvider()
    const app = createSSRApp({
      render: () => h(TemplateProvider, null, { default: () => h('p', 'page') }),
    })

    app.runWithContext(() => useTemplate({ component: () => h('dialog', 'shown in a plugin') }).show())
    await renderToString(app)

    expect(warn).toHaveBeenCalledOnce()
    expect(warn.mock.calls[0][0]).toContain('outside a component on the server')
  })

  it('keeps renders isolated from each other', async () => {
    const { TemplateProvider, useTemplate } = createTemplateProvider()
    const AsyncPage = defineComponent({
      async setup() {
        const { show } = useTemplate({ component: () => h('dialog', 'leaked') })
        await Promise.resolve()
        show()
        return () => h('p', 'async page')
      },
    })
    await renderToString(createSSRApp({
      render: () => h(TemplateProvider, null, { default: () => h(AsyncPage) }),
    }))

    const nextRequest = await renderToString(createSSRApp({
      render: () => h(TemplateProvider, null, { default: () => h('p', 'next request') }),
    }))

    expect(nextRequest).not.toContain('leaked')
  })

  it('ignores show() from a useTemplate() called after an await, with a warning', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    onTestFinished(() => warn.mockRestore())
    const { TemplateProvider, useTemplate } = createTemplateProvider()
    const AsyncPage = defineComponent({
      async setup() {
        await Promise.resolve()
        useTemplate({ component: () => h('dialog', 'leaked') }).show()
        return () => h('p', 'async page')
      },
    })

    await renderToString(createSSRApp({
      render: () => h(TemplateProvider, null, { default: () => h(AsyncPage) }),
    }))

    expect(warn).toHaveBeenCalledOnce()
    expect(warn.mock.calls[0][0]).toContain('outside a component on the server')
  })
})
