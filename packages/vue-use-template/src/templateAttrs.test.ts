// @vitest-environment jsdom

import { describe, expect, it, vi } from 'vitest'
import { computed, createApp, defineComponent, h, nextTick, ref } from 'vue'
import { templateToVNodeFn } from './utils'

const Dialog = defineComponent({
  props: { title: String },
  emits: ['confirm'],
  setup: (props, { emit, attrs }) => () => h('dialog', { id: attrs.id, onClick: () => emit('confirm') }, props.title),
})

function mount(render: () => unknown) {
  const el = document.createElement('div')
  createApp({ render }).mount(el)
  return el
}

describe('template attrs, props and emits', () => {
  it.each([
    ['a plain object', <T>(value: T) => value],
    ['a ref', <T>(value: T) => ref(value)],
    ['a computed', <T>(value: T) => computed(() => value)],
    ['a getter', <T>(value: T) => () => value],
  ])('are applied when given as %s', (_name, wrap) => {
    const onConfirm = vi.fn()
    const vNodeFn = templateToVNodeFn({
      component: Dialog,
      attrs: wrap({ id: 'from-attrs' }) as any,
      props: wrap({ title: 'from props' }) as any,
      emits: wrap({ onConfirm }) as any,
    })

    const el = mount(() => vNodeFn())
    el.querySelector('dialog')!.click()

    expect(el.innerHTML).toBe('<dialog id="from-attrs">from props</dialog>')
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('re-renders when a getter reads a ref that changes', async () => {
    const title = ref('before')
    const vNodeFn = templateToVNodeFn({ component: Dialog, props: () => ({ title: title.value }) })
    const el = mount(() => vNodeFn())

    title.value = 'after'
    await nextTick()

    expect(el.innerHTML).toBe('<dialog>after</dialog>')
  })
})
