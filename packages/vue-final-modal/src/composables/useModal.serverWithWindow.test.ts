// @vitest-environment jsdom
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { markServer } from 'vue-use-template'
import { ModalsContainer, createVfm, useModal } from '../index'

function createRequestApp() {
  const app = createSSRApp({ render: () => h(ModalsContainer) })
  app.use(createVfm())
  return app
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useModal() on a server that polyfills window', () => {
  it('skips open() from a plugin once the server is marked, even before its first render, and resolves it right away', async () => {
    markServer()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const app = createRequestApp()
    const opened = app.runWithContext(() => useModal({ slots: { default: 'Hello World!' } }).open())
    const stillPending = new Promise(resolve => setTimeout(resolve, 0, 'still pending'))

    await expect(Promise.race([opened, stillPending])).resolves.toContain('not opened')
    expect(await renderToString(app)).not.toContain('Hello World!')
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('outside a component is skipped on the server'))
  })
})
