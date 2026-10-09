// @vitest-environment jsdom
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { ModalsContainer, createVfm, markServer, useModal } from '../index'

function createRequestApp() {
  const app = createSSRApp({ render: () => h(ModalsContainer) })
  app.use(createVfm())
  return app
}

beforeAll(() => {
  markServer()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useModal() on a server that polyfills window', () => {
  it('warns and skips open() outside any app context instead of throwing', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const modal = useModal({ slots: { default: 'Hello World!' } })

    await expect(modal.open()).resolves.toContain('not opened')
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('open() is ignored on the server'))
  })

  it('skips open() from a plugin once the server is marked, even before its first render, and resolves it right away', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const app = createRequestApp()
    const opened = app.runWithContext(() => useModal({ slots: { default: 'Hello World!' } }).open())
    const stillPending = new Promise(resolve => setTimeout(resolve, 0, 'still pending'))

    await expect(Promise.race([opened, stillPending])).resolves.toContain('not opened')
    expect(await renderToString(app)).not.toContain('Hello World!')
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('outside a component is skipped on the server'))
  })
})
