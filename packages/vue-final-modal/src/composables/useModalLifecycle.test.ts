// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { createApp, defineComponent, h, nextTick, watch } from 'vue'
import { createVfm, modalComponentEmits, modalComponentProps, ModalsContainer, useModal, useModalLifecycle } from '../index'

const apps: { unmount: () => void }[] = []

afterEach(() => {
  apps.splice(0).forEach(app => app.unmount())
  document.body.innerHTML = ''
})

function mountApp() {
  const el = document.createElement('div')
  document.body.append(el)
  const app = createApp({ render: () => h(ModalsContainer) })
  app.use(createVfm()).mount(el)
  apps.push(app)
}

function settled<T>(promise: Promise<T> | undefined) {
  return Promise.race([promise, new Promise(resolve => setTimeout(resolve, 100, 'still pending'))])
}

/** A user's own modal whose transitions finish when the test says so. */
function createOwnModal() {
  const transitions: { opening: boolean, finish: () => void }[] = []
  function transition(opening: boolean) {
    return new Promise<void>(finish => transitions.push({ opening, finish }))
  }
  const OwnModal = defineComponent({
    props: modalComponentProps,
    emits: modalComponentEmits,
    setup(props, { emit }) {
      const { isOpen, status } = useModalLifecycle(props, emit, {
        open: () => transition(true),
        close: () => transition(false),
      })
      return () => h('div', { class: 'own-modal' }, [
        isOpen.value ? 'open' : 'closed',
        h('span', { class: 'status' }, status.value),
        h('button', { onClick: () => isOpen.value = false }),
      ])
    },
  })
  return { OwnModal, transitions }
}

describe('useModalLifecycle()', () => {
  it('lets useModal() settle open() and close() of a user component once its transitions finish', async () => {
    mountApp()
    const { OwnModal, transitions } = createOwnModal()
    const modal = useModal({ component: OwnModal })

    const opened = modal.open()
    await expect.poll(() => transitions.length).toBe(1)
    await expect(settled(opened)).resolves.toBe('still pending')
    transitions[0]!.finish()
    await expect(settled(opened)).resolves.toBe('opened')

    const closed = modal.close()
    await expect.poll(() => transitions.length).toBe(2)
    expect(transitions[1]!.opening).toBe(false)
    await expect(settled(closed)).resolves.toBe('still pending')
    transitions[1]!.finish()
    await expect(settled(closed)).resolves.toBe('closed')
    await nextTick()
    expect(document.querySelector('.own-modal')).toBeNull()
  })

  it('closes from inside the component and writes back modelValue', async () => {
    mountApp()
    const { OwnModal, transitions } = createOwnModal()
    const updates: boolean[] = []
    const modal = useModal({ component: OwnModal, attrs: { 'onUpdate:modelValue': (value: boolean) => updates.push(value) } })
    const opened = modal.open()
    await expect.poll(() => transitions.length).toBe(1)
    transitions[0]!.finish()
    await settled(opened)

    document.querySelector('button')!.click()
    await expect.poll(() => transitions.length).toBe(2)
    expect(updates).toEqual([false])
    transitions[1]!.finish()
    await expect.poll(() => document.querySelector('.own-modal')).toBeNull()
  })

  it('skips opened when the component is closed before it finished opening', async () => {
    mountApp()
    const { OwnModal, transitions } = createOwnModal()
    const events: string[] = []
    const modal = useModal({ component: OwnModal, attrs: { onOpened: () => events.push('opened'), onClosed: () => events.push('closed') } })
    const opened = modal.open()
    await expect.poll(() => transitions.length).toBe(1)

    document.querySelector('button')!.click()
    await expect.poll(() => transitions.length).toBe(2)
    transitions[0]!.finish()
    transitions[1]!.finish()

    await expect(settled(opened)).resolves.toBe('toggled-again')
    expect(events).toEqual(['closed'])
  })

  it('reports opening and closing while its transitions run, to useModal() and to the component', async () => {
    mountApp()
    const { OwnModal, transitions } = createOwnModal()
    const modal = useModal({ component: OwnModal })
    const shownStatus = () => document.querySelector('.status')?.textContent

    modal.open()
    await expect.poll(() => transitions.length).toBe(1)
    expect(modal.status.value).toBe('opening')
    expect(shownStatus()).toBe('opening')
    transitions[0]!.finish()
    await expect.poll(() => modal.status.value).toBe('opened')
    expect(shownStatus()).toBe('opened')

    document.querySelector('button')!.click()
    await expect.poll(() => transitions.length).toBe(2)
    expect(modal.status.value).toBe('closing')
    expect(shownStatus()).toBe('closing')
    transitions[1]!.finish()
    await expect.poll(() => modal.status.value).toBe('closed')
  })

  it('turns from opening to closing when the component closes before it finished opening', async () => {
    mountApp()
    const { OwnModal, transitions } = createOwnModal()
    const modal = useModal({ component: OwnModal })
    const statuses: string[] = []
    watch(modal.status, status => statuses.push(status), { flush: 'sync' })

    const opened = modal.open()
    await expect.poll(() => transitions.length).toBe(1)
    document.querySelector('button')!.click()
    await expect.poll(() => transitions.length).toBe(2)
    transitions[0]!.finish()
    transitions[1]!.finish()

    await expect(settled(opened)).resolves.toBe('toggled-again')
    expect(statuses).toEqual(['opening', 'closing', 'closed'])
  })
})
