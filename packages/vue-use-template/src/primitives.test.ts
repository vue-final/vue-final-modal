// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { createApp, defineComponent, h, nextTick } from 'vue'
import {
  createTemplateOutlet,
  createTemplateProvider,
  createTemplateState,
  createUseTemplate,
  TemplateProvider,
  useTemplate,
} from './index'

describe('installed template states', () => {
  it('keeps two installed apps on one page apart', async () => {
    function mountApp(text: string) {
      const el = document.createElement('div')
      const app = createApp(defineComponent({
        setup() {
          useTemplate({ component: () => h('dialog', text) }, { showByDefault: true })
          return () => h(TemplateProvider)
        },
      }))
      app.use(createTemplateProvider())
      app.mount(el)
      return el
    }

    const first = mountApp('first app')
    const second = mountApp('second app')
    await nextTick()

    expect(first.innerHTML).toContain('first app')
    expect(first.innerHTML).not.toContain('second app')
    expect(second.innerHTML).toContain('second app')
    expect(second.innerHTML).not.toContain('first app')
  })

  it('shows a template from outside setup in the installed app', async () => {
    const el = document.createElement('div')
    const app = createApp({ render: () => h(TemplateProvider) })
    app.use(createTemplateProvider())
    app.mount(el)

    useTemplate({ component: () => h('dialog', 'outside setup') }).show()
    await nextTick()

    expect(el.innerHTML).toContain('outside setup')
  })
})

describe('primitives', () => {
  it('renders a state through createUseTemplate() and createTemplateOutlet()', async () => {
    const state = createTemplateState()
    const useStateTemplate = createUseTemplate(state)
    const Outlet = createTemplateOutlet(state)
    const el = document.createElement('div')
    createApp({ render: () => h(Outlet) }).mount(el)

    useStateTemplate({ component: () => h('dialog', 'from primitives') }).show()
    await nextTick()

    expect(el.innerHTML).toContain('from primitives')
  })
})
