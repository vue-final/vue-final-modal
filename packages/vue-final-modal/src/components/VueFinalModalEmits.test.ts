// @vitest-environment jsdom
import { createApp, h } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import { ModalsContainer, createVfm, useModal } from '../index'
import ModalWithVfmEmits from './VueFinalModalEmits.fixture.vue'

const apps: { unmount: () => void }[] = []

afterEach(() => {
  apps.splice(0).forEach(app => app.unmount())
  document.body.innerHTML = ''
})

function settled<T>(promise: Promise<T>) {
  return Promise.race([promise, new Promise(resolve => setTimeout(resolve, 1000, 'still pending'))])
}

describe('VueFinalModalEmits', () => {
  it('lets useModal() settle a wrapper that declares it as its emits', async () => {
    const el = document.createElement('div')
    document.body.append(el)
    const app = createApp({ render: () => h(ModalsContainer) })
    app.use(createVfm()).mount(el)
    apps.push(app)
    const modal = useModal({ component: ModalWithVfmEmits, attrs: { focusTrap: false } })

    await expect(settled(modal.open())).resolves.toBe('opened')
    await expect(settled(modal.close())).resolves.toBe('closed')
    await expect.poll(() => document.querySelector('.vfm')).toBeNull()
  })
})
