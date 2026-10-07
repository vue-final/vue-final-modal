import type { Component } from 'vue'
import type { SSRContext } from 'vue/server-renderer'
import { describe, expect, it } from 'vitest'
import * as vue from 'vue'
import { renderToString } from 'vue/server-renderer'
import { ModalsContainer, VueFinalModal, createVfm, useModal } from './index'

const { createSSRApp, h } = vue
/** A compiler helper: exported at runtime but left out of Vue's public types. */
const { withAsyncContext } = vue as unknown as { withAsyncContext: <T>(getAwaitable: () => T) => [T, () => void] }

async function renderWithVfm(Page: Component) {
  const app = createSSRApp({ render: () => [h(Page), h(ModalsContainer)] })
  app.use(createVfm())
  const ctx: SSRContext = {}
  const html = await renderToString(app, ctx)
  return { html, teleported: String(ctx.teleports?.body ?? '') }
}

describe('server-side rendering', () => {
  it('renders the content of a modal opened in setup into the server HTML', async () => {
    const Page: Component = {
      setup() {
        useModal({ component: VueFinalModal, slots: { default: 'Hello from setup' } }).open()
        return () => h('p', 'page')
      },
    }

    const { teleported } = await renderWithVfm(Page)

    expect(teleported).toContain('Hello from setup')
  })

  it('resolves open() during a server render instead of hanging it', async () => {
    const Page: Component = {
      async setup() {
        await useModal({ component: VueFinalModal, slots: { default: 'Awaited' } }).open()
        return () => h('p', 'page')
      },
    }

    const result = await Promise.race([
      renderWithVfm(Page).then(() => 'rendered'),
      new Promise(resolve => setTimeout(() => resolve('still rendering after 1s'), 1000)),
    ])

    expect(result).toBe('rendered')
  })

  it('resolves close() right after open() during a server render', async () => {
    const Page: Component = {
      async setup() {
        const modal = useModal({ component: VueFinalModal, slots: { default: 'Closed again' } })
        await modal.open()
        await modal.close()
        return () => h('p', 'page')
      },
    }

    const result = await Promise.race([
      renderWithVfm(Page).then(() => 'rendered'),
      new Promise(resolve => setTimeout(() => resolve('still rendering after 1s'), 1000)),
    ])

    expect(result).toBe('rendered')
  })

  it('resolves open() awaited after loading data, when ModalsContainer has already rendered', async () => {
    const Page: Component = {
      async setup() {
        /** What <script setup> compiles `await loadData()` to. */
        const [dataLoaded, restoreContext] = withAsyncContext(() => new Promise(resolve => setTimeout(resolve)))
        await dataLoaded
        restoreContext()
        await useModal({ component: VueFinalModal, slots: { default: 'After data' } }).open()
        return () => h('p', 'page')
      },
    }

    const result = await Promise.race([
      renderWithVfm(Page).then(() => 'rendered'),
      new Promise(resolve => setTimeout(() => resolve('still rendering after 1s'), 1000)),
    ])

    expect(result).toBe('rendered')
  })
})
