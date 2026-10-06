// @vitest-environment jsdom

import { describe, expect, it, vi } from 'vitest'
import { createSSRApp, defineComponent, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { ModalsContainer, VueFinalModal, createVfm, useModal } from './index'

const Page = defineComponent({
  setup() {
    useModal({
      component: VueFinalModal,
      attrs: { teleportTo: false, focusTrap: false },
      slots: { default: 'Hello from setup' },
    }).open()
    return () => h('p', 'page')
  },
})

function createApp() {
  const app = createSSRApp({ render: () => [h(Page), h(ModalsContainer)] })
  app.use(createVfm())
  return app
}

describe('hydration', () => {
  it('hydrates a modal opened in setup with its content and without mismatches', async () => {
    const container = document.createElement('div')
    container.innerHTML = await renderToString(createApp())
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})

    createApp().mount(container)

    const hydrationMessages = [...warn.mock.calls, ...error.mock.calls]
      .map(([message]) => String(message))
      .filter(message => message.includes('ydration'))
    expect(container.textContent).toContain('Hello from setup')
    expect(hydrationMessages).toEqual([])
  })
})
