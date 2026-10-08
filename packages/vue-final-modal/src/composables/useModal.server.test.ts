import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ModalsContainer, createVfm, useModal } from '../index'
import { ALREADY_CLOSED } from '../utils'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useModal() on the server', () => {
  it('warns and skips open() outside any app context instead of throwing', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const modal = useModal({ slots: { default: 'Hello World!' } })

    await expect(modal.open()).resolves.toContain('not opened')
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('open() is ignored on the server'))
  })

  it('skips open() from a plugin and resolves it right away, without rendering the modal', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const app = createSSRApp({ render: () => h(ModalsContainer) })
    app.use(createVfm())
    const opened = app.runWithContext(() => useModal({ slots: { default: 'Hello World!' } }).open())
    const stillPending = new Promise(resolve => setTimeout(resolve, 0, 'still pending'))

    await expect(Promise.race([opened, stillPending])).resolves.toContain('not opened')
    expect(await renderToString(app)).not.toContain('Hello World!')
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('outside a component is skipped on the server'))
    expect(warn).not.toHaveBeenCalledWith(expect.stringContaining('useTemplate()'))
  })

  it('lets close() settle for a modal a plugin creates open, which the server skipped', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const app = createSSRApp({ render: () => h(ModalsContainer) })
    app.use(createVfm())
    const modal = app.runWithContext(() => useModal({ defaultModelValue: true, slots: { default: 'Hello World!' } }))
    const stillPending = new Promise(resolve => setTimeout(resolve, 0, 'still pending'))

    await expect(Promise.race([modal.close(), stillPending])).resolves.toBe(ALREADY_CLOSED)
  })

  it('skips a modal a plugin creates open, with the same warning', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const app = createSSRApp({ render: () => h(ModalsContainer) })
    app.use(createVfm())
    app.runWithContext(() => useModal({ defaultModelValue: true, slots: { default: 'Hello World!' } }))

    expect(await renderToString(app)).not.toContain('Hello World!')
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('outside a component is skipped on the server'))
    expect(warn).not.toHaveBeenCalledWith(expect.stringContaining('useTemplate()'))
  })
})
