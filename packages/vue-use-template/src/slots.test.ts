// @vitest-environment jsdom
import type { Component } from 'vue'
import type { Template } from './types'
import { describe, expect, it, vi } from 'vitest'
import { createApp, createSSRApp, defineComponent, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { defineTemplate, templateToVNodeFn } from './utils'

const Dialog = defineComponent({
  setup: (_props, { slots }) => () => h('dialog', slots.default?.()),
})

const Paragraph = defineComponent({
  props: { text: String },
  setup: props => () => h('p', props.text),
})

type Slot = string | Component | Template<Component>

function renderOnServer(slot: Slot) {
  const vNodeFn = templateToVNodeFn({ component: Dialog, slots: { default: slot } })
  return renderToString(createSSRApp({ render: () => vNodeFn() }))
}

function renderOnClient(slot: Slot) {
  const vNodeFn = templateToVNodeFn({ component: Dialog, slots: { default: slot } })
  const el = document.createElement('div')
  createApp({ render: () => vNodeFn() }).mount(el)
  return el.innerHTML
}

describe('slots', () => {
  it.each<[string, Slot, string]>([
    ['a string as raw HTML inside a div', '<b>raw</b>', '<dialog><div><b>raw</b></div></dialog>'],
    ['a component object', Paragraph, '<dialog><p></p></dialog>'],
    ['a nested template', defineTemplate({ component: Paragraph, props: { text: 'nested' } }), '<dialog><p>nested</p></dialog>'],
    ['a functional component', () => h('p', 'functional'), '<dialog><p>functional</p></dialog>'],
    ['a functional component inside a nested template', defineTemplate({ component: Dialog, slots: { default: () => h('p', 'deep') } }), '<dialog><dialog><p>deep</p></dialog></dialog>'],
  ])('renders %s', async (_name, slot, html) => {
    expect(await renderOnServer(slot)).toBe(html)
    expect(renderOnClient(slot)).toBe(html)
  })

  it('leaves calling a functional component slot to the component that renders it', () => {
    const slot = vi.fn(() => h('p'))

    templateToVNodeFn({ component: Dialog, slots: { default: slot } })()

    expect(slot).not.toHaveBeenCalled()
  })
})
