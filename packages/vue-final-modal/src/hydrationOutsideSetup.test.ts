// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'

/** One module registry per side, like the separate server and browser processes. */
async function importSide() {
  vi.resetModules()
  const vue = await import('vue')
  const server = await import('vue/server-renderer')
  const vfm = await import('./index')
  return { ...vue, ...server, ...vfm }
}

type Side = Awaited<ReturnType<typeof importSide>>
type OpenedFrom = 'a plugin' | 'setup'

/** A Nuxt plugin or route middleware opens the modal with the app's injection context, before the app renders. */
function createApp(lib: Side, openedFrom: OpenedFrom, teleportTo: string | false) {
  const open = () => lib.useModal({
    component: lib.VueFinalModal,
    attrs: { teleportTo, focusTrap: false },
    slots: { default: `Opened from ${openedFrom}` },
  }).open()
  const Page = lib.defineComponent({
    setup() {
      if (openedFrom === 'setup')
        open()
      return () => lib.h('p', 'page')
    },
  })
  const app = lib.createSSRApp({ render: () => [lib.h(Page), lib.h(lib.ModalsContainer)] })
  app.use(lib.createVfm())
  if (openedFrom === 'a plugin')
    app.runWithContext(open)
  return app
}

afterEach(() => {
  document.body.innerHTML = ''
  /** Teleport hydration remembers where the last teleported content ended; a real page hydrates once. */
  delete (document.body as { _lpa?: unknown })._lpa
  vi.restoreAllMocks()
})

describe('hydrating a modal opened before the app renders', () => {
  const cases: [OpenedFrom, string | false][] = [['a plugin', false], ['a plugin', 'body'], ['setup', false], ['setup', 'body']]
  for (const [openedFrom, teleportTo] of cases) {
    it(`claims the server-rendered modal once when it is opened from ${openedFrom} (teleportTo: ${teleportTo})`, async () => {
      const server = await importSide()
      const ssrContext: { teleports?: Record<string, string> } = {}
      const html = await server.renderToString(createApp(server, openedFrom, teleportTo), ssrContext)
      const teleported = ssrContext.teleports?.body ?? ''
      expect(html + teleported).toContain(`Opened from ${openedFrom}`)

      const client = await importSide()
      /** Vue hydrates content teleported to the body from its first child on, which is where the renderer puts it. */
      document.body.innerHTML = `${teleported}<div id="app">${html}</div>`
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const error = vi.spyOn(console, 'error').mockImplementation(() => {})
      createApp(client, openedFrom, teleportTo).mount('#app')
      await new Promise(resolve => setTimeout(resolve))

      const messages = [...warn.mock.calls, ...error.mock.calls].map(args => args.map(String).join(' '))
      expect(messages.filter(message => /hydration/i.test(message))).toEqual([])
      expect(document.querySelectorAll('.vfm')).toHaveLength(1)
    })
  }
})
