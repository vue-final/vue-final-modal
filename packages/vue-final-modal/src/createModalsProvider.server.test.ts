import { createSSRApp, defineComponent, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { describe, expect, it } from 'vitest'
import { createModalsProvider } from './index'

/** Made at module level, as micro frontends do, so every request of the server shares it. */
const { ModalsProvider, useModal } = createModalsProvider()

function renderRequest() {
  const Page = defineComponent({
    setup() {
      useModal({ attrs: { teleportTo: false }, slots: { default: 'Shared' } }).open()
      return () => h('p', 'page')
    },
  })
  return renderToString(createSSRApp({ render: () => h(ModalsProvider, null, { default: () => h(Page) }) }))
}

describe('a modals provider shared by every request of the server', () => {
  it('renders a modal opened in setup into every request, at the same z-index', async () => {
    const first = await renderRequest()
    const second = await renderRequest()

    expect([first, second].map(html => [html.includes('Shared'), html.match(/z-index:\s*(\d+)/)?.[1]])).toEqual([
      [true, '1000'],
      [true, '1000'],
    ])
  })
})
