import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp, defineComponent, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createVfm, ModalsContainer, useModal } from '../index'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useModal() on the server', () => {
  it('warns and skips open() outside any app context instead of throwing', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const modal = useModal({ slots: { default: 'Hello World!' } })

    await expect(modal.open()).resolves.toBe('skipped-on-server')
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('open() is ignored on the server'))
  })

  it('skips open() from a plugin and resolves it right away, without rendering the modal', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const app = createSSRApp({ render: () => h(ModalsContainer) })
    app.use(createVfm())
    const opened = app.runWithContext(() => useModal({ slots: { default: 'Hello World!' } }).open())
    const stillPending = new Promise(resolve => setTimeout(resolve, 0, 'still pending'))

    await expect(Promise.race([opened, stillPending])).resolves.toBe('skipped-on-server')
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

    await expect(Promise.race([modal.close(), stillPending])).resolves.toBe('already-closed')
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

  it('skips open() in setup for a modal created outside a component, so no request leaves it open for the next one', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const modal = useModal({ slots: { default: 'Hello World!' } })
    const results: string[] = []
    function render() {
      const Page = defineComponent({
        setup() {
          modal.open().then(result => results.push(result))
          return () => h('p', 'page')
        },
      })
      const app = createSSRApp({ render: () => [h(Page), h(ModalsContainer)] })
      app.use(createVfm())
      return renderToString(app)
    }

    expect(await render()).not.toContain('Hello World!')
    expect(await render()).not.toContain('Hello World!')
    await new Promise(resolve => setTimeout(resolve))
    expect(results).toEqual(['skipped-on-server', 'skipped-on-server'])
    expect(warn.mock.calls.flat().join('\n')).toContain('created or opened outside a component is skipped on the server')
  })

  it('reports a modal opened in setup as opened, and a skipped one as closed', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const skipped = useModal({ slots: { default: 'Skipped' } })
    let opened: ReturnType<typeof useModal> | undefined
    const Page = defineComponent({
      setup() {
        opened = useModal({ attrs: { teleportTo: false }, slots: { default: 'Hello World!' } })
        opened.open()
        skipped.open()
        return () => h('p', 'page')
      },
    })
    const app = createSSRApp({ render: () => [h(Page), h(ModalsContainer)] })
    app.use(createVfm())

    expect(await renderToString(app)).toContain('Hello World!')
    expect(opened!.status.value).toBe('opened')
    expect(skipped.status.value).toBe('closed')
  })
})
