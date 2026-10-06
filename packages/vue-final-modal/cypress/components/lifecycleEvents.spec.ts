import { h, ref } from 'vue'
import App from './App.vue'
import VueFinalModal from '~/components/VueFinalModal.vue'
import { createVfm, useModal } from '~/index'
import '../../dist/style.css'

type Entry = {
  event: 'beforeOpen' | 'opened' | 'beforeClose' | 'closed'
  at: number
  /** The content element at the time the event fired, if rendered. */
  content: null | { transitioning: boolean; shown: boolean }
}

function recorder() {
  const entries: Entry[] = []
  const record = (event: Entry['event']) => {
    const el = document.querySelector<HTMLElement>('.vfm__content')
    entries.push({
      event,
      at: performance.now(),
      content: el && { transitioning: /enter|leave/.test(el.className), shown: getComputedStyle(el).display !== 'none' },
    })
  }
  const listeners = {
    onBeforeOpen: () => record('beforeOpen'),
    onOpened: () => record('opened'),
    onBeforeClose: () => record('beforeClose'),
    onClosed: () => record('closed'),
  }
  const names = () => entries.map(entry => entry.event)
  const gap = (from: Entry['event'], to: Entry['event']) => entries.find(e => e.event === to)!.at - entries.find(e => e.event === from)!.at
  return { entries, listeners, names, gap }
}

const fade = { contentTransition: 'vfm-fade', overlayTransition: 'vfm-fade' }
const mountOptions = (vfm: ReturnType<typeof createVfm>) => ({ global: { plugins: [vfm], stubs: { transition: false } } })

describe('Events: beforeOpen, opened, beforeClose and closed', () => {
  it('fire once each, in order, before and after the transitions', () => {
    const vfm = createVfm()
    const { entries, listeners, names, gap } = recorder()
    const modal = useModal({ component: VueFinalModal, attrs: { ...fade, ...listeners }, slots: { default: 'Hello' } })

    cy.mount(App, mountOptions(vfm))
    cy.then(() => {
      modal.open()
    })
    cy.wrap(entries).should(() => expect(names()).to.deep.equal(['beforeOpen', 'opened']))
    cy.then(() => {
      modal.close()
    })
    cy.wrap(entries).should(() => expect(names()).to.deep.equal(['beforeOpen', 'opened', 'beforeClose', 'closed']))

    cy.then(() => {
      /** beforeOpen fires before anything is rendered; opened once the enter transition is over. */
      expect(entries[0].content).to.equal(null)
      expect(entries[1].content).to.deep.equal({ transitioning: false, shown: true })
      expect(gap('beforeOpen', 'opened')).to.be.greaterThan(250)
      /** beforeClose fires while the content is still shown; closed once the leave transition is over and the content is hidden. */
      expect(entries[2].content).to.deep.equal({ transitioning: false, shown: true })
      expect(entries[3].content).to.deep.equal({ transitioning: false, shown: false })
      expect(gap('beforeClose', 'closed')).to.be.greaterThan(250)
    })
    cy.get('.vfm').should('not.exist')
  })

  it('stop() in beforeOpen or beforeClose swallows the open or close, and no opened or closed follows', () => {
    const vfm = createVfm()
    const { entries, listeners, names } = recorder()
    const stopNext = ref(false)
    const stopIfAsked = (event: { stop: () => void }) => {
      if (stopNext.value)
        event.stop()
    }
    const modal = useModal({
      component: VueFinalModal,
      attrs: {
        ...listeners,
        onBeforeOpen: (event) => {
          listeners.onBeforeOpen()
          stopIfAsked(event)
        },
        onBeforeClose: (event) => {
          listeners.onBeforeClose()
          stopIfAsked(event)
        },
      },
      slots: { default: 'Hello' },
    })

    cy.mount(App, mountOptions(vfm))

    cy.then(() => {
      stopNext.value = true
      modal.open()
    })
    cy.wrap(entries).should(() => expect(names()).to.deep.equal(['beforeOpen']))
    cy.wait(100)
    cy.get('.vfm').should('not.exist')
    cy.wrap(entries).should(() => expect(names()).to.deep.equal(['beforeOpen']))

    cy.then(() => {
      stopNext.value = false
      modal.open()
    })
    cy.wrap(entries).should(() => expect(names()).to.deep.equal(['beforeOpen', 'beforeOpen', 'opened']))

    cy.then(() => {
      stopNext.value = true
      modal.close()
    })
    cy.wrap(entries).should(() => expect(names()).to.deep.equal(['beforeOpen', 'beforeOpen', 'opened', 'beforeClose']))
    cy.wait(100)
    cy.contains('Hello').should('be.visible')
    cy.wrap(entries).should(() => expect(names()).to.deep.equal(['beforeOpen', 'beforeOpen', 'opened', 'beforeClose']))

    cy.then(() => {
      stopNext.value = false
      modal.close()
    })
    cy.wrap(entries).should(() => expect(names()).to.deep.equal(['beforeOpen', 'beforeOpen', 'opened', 'beforeClose', 'beforeClose', 'closed']))
    cy.get('.vfm').should('not.exist')
  })

  it('fire through the component events of a modal driven by v-model', () => {
    const vfm = createVfm()
    const { entries, listeners, names } = recorder()
    const show = ref(false)

    cy.mount({
      setup: () => () => h(VueFinalModal, {
        'modelValue': show.value,
        'onUpdate:modelValue': (value: boolean) => (show.value = value),
        'teleportTo': false,
        ...fade,
        ...listeners,
      }, () => 'Hello'),
    }, mountOptions(vfm))

    cy.then(() => show.value = true)
    cy.wrap(entries).should(() => expect(names()).to.deep.equal(['beforeOpen', 'opened']))
    cy.then(() => show.value = false)
    cy.wrap(entries).should(() => expect(names()).to.deep.equal(['beforeOpen', 'opened', 'beforeClose', 'closed']))
  })

  it('fire when the modal is driven by vfm.open() and vfm.close() with a modalId', () => {
    const vfm = createVfm()
    const { entries, listeners, names } = recorder()

    cy.mount({ render: () => h(VueFinalModal, { modalId: 'events', teleportTo: false, ...fade, ...listeners }, () => 'Hello') }, mountOptions(vfm))

    cy.then(() => {
      vfm.open('events')
    })
    cy.wrap(entries).should(() => expect(names()).to.deep.equal(['beforeOpen', 'opened']))
    cy.then(() => {
      vfm.close('events')
    })
    cy.wrap(entries).should(() => expect(names()).to.deep.equal(['beforeOpen', 'opened', 'beforeClose', 'closed']))
  })

  it('fire on every cycle of a modal kept alive', () => {
    const vfm = createVfm()
    const { entries, listeners, names } = recorder()
    const modal = useModal({ keepAlive: true, component: VueFinalModal, attrs: { ...fade, ...listeners }, slots: { default: 'Hello' } })
    const cycle = ['beforeOpen', 'opened', 'beforeClose', 'closed']

    cy.mount(App, mountOptions(vfm))
    cy.then(() => {
      modal.open()
    })
    cy.wrap(entries).should(() => expect(names()).to.deep.equal(cycle.slice(0, 2)))
    cy.then(() => {
      modal.close()
    })
    cy.wrap(entries).should(() => expect(names()).to.deep.equal(cycle))
    cy.get('.vfm').should('not.be.visible')
    cy.then(() => {
      modal.open()
    })
    cy.wrap(entries).should(() => expect(names()).to.deep.equal([...cycle, 'beforeOpen', 'opened']))
    cy.then(() => {
      modal.close()
    })
    cy.wrap(entries).should(() => expect(names()).to.deep.equal([...cycle, ...cycle]))
  })

  it('still fire all four, in order, when close() interrupts the opening', () => {
    const vfm = createVfm()
    const { entries, listeners, names } = recorder()
    const modal = useModal({ component: VueFinalModal, attrs: { ...fade, ...listeners }, slots: { default: 'Hello' } })

    cy.mount(App, mountOptions(vfm))
    cy.then(() => {
      modal.open()
      modal.close()
    })
    cy.wrap(entries).should(() => expect(names()).to.deep.equal(['beforeOpen', 'opened', 'beforeClose', 'closed']))
    cy.get('.vfm').should('not.exist')
  })

  it('do not report closed when open() interrupts the closing', () => {
    const vfm = createVfm()
    const { entries, listeners, names } = recorder()
    const modal = useModal({ component: VueFinalModal, attrs: { ...fade, ...listeners }, slots: { default: 'Hello' } })

    cy.mount(App, mountOptions(vfm))
    cy.then(() => {
      modal.open()
    })
    cy.wrap(entries).should(() => expect(names()).to.deep.equal(['beforeOpen', 'opened']))
    cy.then(() => {
      modal.close()
    })
    cy.wait(100)
    cy.then(() => {
      modal.open()
    })
    cy.wrap(entries).should(() => expect(names()).to.deep.equal(['beforeOpen', 'opened', 'beforeClose', 'beforeOpen', 'opened']))
    cy.contains('Hello').should('be.visible')
    cy.wait(400)
    cy.wrap(entries).should(() => expect(names()).to.deep.equal(['beforeOpen', 'opened', 'beforeClose', 'beforeOpen', 'opened']))
  })

  it('wait for a longer overlay transition before opened and closed', () => {
    const vfm = createVfm()
    const { entries, listeners, names, gap } = recorder()
    const modal = useModal({
      component: VueFinalModal,
      attrs: { contentTransition: 'vfm-fade', overlayTransition: { name: 'vfm-fade', duration: 1200 }, ...listeners },
      slots: { default: 'Hello' },
    })

    cy.mount(App, mountOptions(vfm))
    cy.then(() => {
      modal.open()
    })
    cy.wrap(entries, { timeout: 4000 }).should(() => expect(names()).to.deep.equal(['beforeOpen', 'opened']))
    cy.then(() => expect(gap('beforeOpen', 'opened')).to.be.greaterThan(1100))
    cy.then(() => {
      modal.close()
    })
    cy.wrap(entries, { timeout: 4000 }).should(() => expect(names()).to.deep.equal(['beforeOpen', 'opened', 'beforeClose', 'closed']))
    cy.then(() => expect(gap('beforeClose', 'closed')).to.be.greaterThan(1100))
  })
})
