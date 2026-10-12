// @vitest-environment jsdom

import { describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick, onMounted, ref } from 'vue'
import { createTemplateProvider } from './createTemplateProvider'

describe('in the browser', () => {
  it('shows a template without reading process, which only exists when a bundler provides it', () => {
    const { useTemplate } = createTemplateProvider()
    const { show } = useTemplate({ component: () => h('dialog') })
    let error: unknown

    vi.stubGlobal('process', undefined)
    try {
      show()
    }
    catch (e) {
      error = e
    }
    finally {
      vi.unstubAllGlobals()
    }

    expect(error).toBeUndefined()
  })

  it('renders a template shown outside any component in the first render of a client-side app', () => {
    const { TemplateProvider, useTemplate } = createTemplateProvider()
    useTemplate({ component: () => h('dialog', 'shown outside a component') }).show()
    const el = document.createElement('div')

    createApp({ render: () => h(TemplateProvider) }).mount(el)

    expect(el.innerHTML).toContain('<dialog>shown outside a component</dialog>')
  })

  it('renders a template shown outside any component as soon as an outlet mounts again from a reused vnode', async () => {
    const { TemplateProvider, useTemplate } = createTemplateProvider()
    useTemplate({ component: () => h('dialog', 'shown outside a component') }).show()
    const el = document.createElement('div')
    let htmlWhenMounted = ''
    const Probe = defineComponent({
      setup() {
        onMounted(() => {
          htmlWhenMounted = el.innerHTML
        })
        return () => null
      },
    })
    const provider = h(TemplateProvider)
    const visible = ref(true)
    createApp({ render: () => (visible.value ? [provider, h(Probe)] : null) }).mount(el)
    visible.value = false
    await nextTick()

    visible.value = true
    await nextTick()

    expect(htmlWhenMounted).toContain('<dialog>shown outside a component</dialog>')
  })

  it('reports that show() renders outside any component', () => {
    const { useTemplate } = createTemplateProvider()

    expect(useTemplate({ component: () => h('dialog') }).ignored).toBe(false)
  })
})

describe('useTemplate options', () => {
  it('still hides on unmount when only showByDefault is passed', async () => {
    const { TemplateProvider, useTemplate } = createTemplateProvider()
    const visible = ref(true)
    const Child = defineComponent({
      setup() {
        useTemplate({ component: () => h('dialog', 'owned by child') }, { showByDefault: true })
        return () => h('p')
      },
    })
    const el = document.createElement('div')
    createApp({
      render: () => h(TemplateProvider, null, { default: () => (visible.value ? h(Child) : null) }),
    }).mount(el)
    expect(el.innerHTML).toContain('owned by child')

    visible.value = false
    await nextTick()

    expect(el.innerHTML).not.toContain('owned by child')
  })
})

describe('rendering open templates', () => {
  it('does not re-render an open template without slots when another one opens', async () => {
    const { TemplateProvider, useTemplate } = createTemplateProvider()
    let renders = 0
    const Dialog = defineComponent({
      props: { title: String },
      setup: props => () => {
        renders++
        return h('dialog', props.title)
      },
    })
    createApp({ render: () => h(TemplateProvider) }).mount(document.createElement('div'))
    useTemplate({ component: Dialog, props: { title: 'already open' } }).show()
    await nextTick()
    renders = 0

    useTemplate({ component: () => h('dialog', 'another') }).show()
    await nextTick()

    expect(renders).toBe(0)
  })
})
