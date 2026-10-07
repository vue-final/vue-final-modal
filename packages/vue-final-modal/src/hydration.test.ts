// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp, defineComponent, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { ModalsContainer, VueFinalModal, createVfm, useModal } from './index'

const Page = defineComponent({
  props: { onOpened: Function },
  setup(props) {
    useModal({
      component: VueFinalModal,
      attrs: { teleportTo: false, focusTrap: false, contentTransition: 'vfm-fade', onOpened: props.onOpened as () => void },
      slots: { default: 'Hello from setup' },
    }).open()
    return () => h('p', 'page')
  },
})

function createApp(onOpened?: () => void) {
  const app = createSSRApp({ render: () => [h(Page, { onOpened }), h(ModalsContainer)] })
  app.use(createVfm())
  return app
}

/** A browser hydrates a container that is in the page, with the server-rendered markup. */
async function serverRenderedContainer() {
  const container = document.body.appendChild(document.createElement('div'))
  container.innerHTML = await renderToString(createApp())
  return container
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('hydration', () => {
  it('renders the z-index of a modal opened in setup into the server HTML', async () => {
    const html = await renderToString(createApp())

    expect(html).toContain('z-index:1000')
  })

  it('hydrates a modal opened in setup already open, without an enter transition', async () => {
    const container = await serverRenderedContainer()
    const onOpened = vi.fn()

    createApp(onOpened).mount(container)
    const content = container.querySelector('.vfm__content')!

    expect(content.className).not.toMatch(/enter/)
    /** Settles by the next task instead of waiting for a transition end. */
    await new Promise(resolve => setTimeout(resolve))
    expect(onOpened).toHaveBeenCalledTimes(1)
  })

  it('hydrates a modal opened in setup with its content and without mismatches', async () => {
    const container = await serverRenderedContainer()
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
