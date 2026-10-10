// @vitest-environment jsdom
import { createApp, defineComponent, h } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ModalsContainer, VueFinalModal, createVfm, useModal, useVfmAttrs, vueFinalModalProps } from '../index'

const MyModal = defineComponent({
  inheritAttrs: false,
  props: { ...vueFinalModalProps, title: { type: String, default: '' } },
  emits: ['update:modelValue', 'beforeOpen', 'opened', 'beforeClose', 'closed', 'clickOutside'],
  setup(props, { emit, slots }) {
    const vfmAttrs = useVfmAttrs({ props, modalProps: vueFinalModalProps, emit })
    return () => h(VueFinalModal, vfmAttrs.value, { default: () => [h('h1', props.title), slots.default?.()] })
  },
})

const apps: { unmount: () => void }[] = []

function mountApp() {
  const el = document.createElement('div')
  document.body.append(el)
  const app = createApp({ render: () => h(ModalsContainer) })
  app.use(createVfm()).mount(el)
  apps.push(app)
}

function settled<T>(promise: Promise<T>) {
  return Promise.race([promise, new Promise(resolve => setTimeout(resolve, 1000, 'still pending'))])
}

afterEach(() => {
  apps.splice(0).forEach(app => app.unmount())
  document.body.innerHTML = ''
})

describe('a wrapper component built with useVfmAttrs()', () => {
  it('opens and closes through useModal()', async () => {
    mountApp()
    const modal = useModal({ component: MyModal, attrs: { title: 'Hello World!', focusTrap: false } })

    await expect(settled(modal.open())).resolves.toBe('opened')
    expect(document.querySelector('.vfm h1')?.textContent).toBe('Hello World!')
    await expect(settled(modal.close())).resolves.toBe('closed')
    await expect.poll(() => document.querySelector('.vfm')).toBeNull()
  })

  it('forwards the modal events', async () => {
    mountApp()
    const onOpened = vi.fn()
    const onClosed = vi.fn()
    const modal = useModal({ component: MyModal, attrs: { focusTrap: false, onOpened, onClosed } })

    await settled(modal.open())
    await settled(modal.close())
    expect([onOpened.mock.calls.length, onClosed.mock.calls.length]).toEqual([1, 1])
  })
})
