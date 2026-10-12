// @vitest-environment jsdom

import type { InjectionKey } from 'vue'
import { describe, expect, it } from 'vitest'
import { createApp, createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createInstanceResolver, createTemplateProvider, isBrowser } from './index'

describe('rendering to a string in the browser', () => {
  it('still counts as a browser afterwards', async () => {
    const { TemplateProvider } = createTemplateProvider()

    await renderToString(createSSRApp({ render: () => h(TemplateProvider) }))

    expect(isBrowser()).toBe(true)
  })

  it('keeps showing templates shown outside any component afterwards', async () => {
    const { TemplateProvider, useTemplate } = createTemplateProvider()
    await renderToString(createSSRApp({ render: () => h(TemplateProvider) }))
    useTemplate({ component: () => h('dialog', 'shown outside a component') }).show()
    const el = document.createElement('div')

    createApp({ render: () => h(TemplateProvider) }).mount(el)

    expect(el.innerHTML).toContain('<dialog>shown outside a component</dialog>')
  })

  it('keeps falling back to the active instance afterwards', async () => {
    const resolver = createInstanceResolver(Symbol('thing') as InjectionKey<string>)
    resolver.setActive('active')
    const { TemplateProvider } = createTemplateProvider()

    await renderToString(createSSRApp({ render: () => h(TemplateProvider) }))

    expect(resolver.resolve()).toBe('active')
  })
})
