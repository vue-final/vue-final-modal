/// <reference lib="es2021.weakref" />
import { setTimeout as sleep } from 'node:timers/promises'
import { describe, expect, it } from 'vitest'
import { createSSRApp, defineComponent, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createTemplateProvider } from './createTemplateProvider'

const requests = 200

const Dialog = defineComponent({
  props: { payload: { type: Object, required: true } },
  setup: props => () => h('dialog', props.payload.text),
})

describe('server-side rendering memory', () => {
  it('lets the templates shown during a render be garbage collected once it ends', async () => {
    const { gc } = globalThis
    if (!gc)
      throw new Error('gc() is missing: vitest.config.ts runs the tests with --expose-gc.')
    let collected = 0
    const registry = new FinalizationRegistry(() => collected++)
    const { TemplateProvider, useTemplate } = createTemplateProvider()

    for (let request = 0; request < requests; request++) {
      const payload = { text: `dialog of request ${request}` }
      registry.register(payload, request)
      const Page = defineComponent({
        setup() {
          useTemplate({ component: Dialog, props: { payload } }, { showByDefault: true })
          return () => h('p', 'page')
        },
      })
      const html = await renderToString(createSSRApp({
        render: () => h(TemplateProvider, null, { default: () => h(Page) }),
      }))
      expect(html).toContain(`<dialog>dialog of request ${request}</dialog>`)
    }
    for (let round = 0; round < 5; round++) {
      gc()
      await sleep(10)
    }

    expect(collected).toBeGreaterThanOrEqual(requests * 0.9)
  })
})
