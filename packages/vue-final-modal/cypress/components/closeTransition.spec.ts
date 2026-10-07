import App from './App.vue'
import VueFinalModal from '~/components/VueFinalModal.vue'
import { createVfm, useModal } from '~/index'
import { TOGGLED_AGAIN } from '~/utils'
import '../../dist/style.css'

const fade = { contentTransition: 'vfm-fade', overlayTransition: 'vfm-fade' }

describe('Programmatic close with real transitions', () => {
  it('open() then close() removes the modal', () => {
    const vfm = createVfm()
    const modal = useModal({
      component: VueFinalModal,
      slots: { default: 'Hello World!' },
    })

    cy.mount(App, { global: { plugins: [vfm], stubs: { transition: false } } }).as('app')

    cy.get('@app').then(() => modal.open())
    cy.contains('Hello World!').should('exist')
    cy.get('@app').then(() => modal.close())
    cy.contains('Hello World!').should('not.exist')
  })

  it('settles open() when close() is called before the modal finished opening', () => {
    const vfm = createVfm()
    const modal = useModal({
      component: VueFinalModal,
      attrs: {
        contentTransition: 'vfm-fade',
        overlayTransition: 'vfm-fade',
      },
      slots: { default: 'Hello World!' },
    })

    cy.mount(App, { global: { plugins: [vfm], stubs: { transition: false } } }).as('app')

    cy.get('@app').then(() => {
      const opening = modal.open()
      const closing = modal.close()
      return Promise.all([opening, closing])
    }).should('deep.equal', ['opened', 'closed'])
    cy.contains('Hello World!').should('not.exist')
  })

  it('keeps the modal until a longer overlay transition has finished', () => {
    const vfm = createVfm()
    const modal = useModal({
      component: VueFinalModal,
      attrs: {
        contentTransition: 'vfm-fade',
        overlayTransition: { name: 'vfm-fade', duration: 1200 },
      },
      slots: { default: 'Hello World!' },
    })

    cy.mount(App, { global: { plugins: [vfm], stubs: { transition: false } } }).as('app')

    cy.get('@app').then(() => modal.open())
    cy.contains('Hello World!').should('exist')
    cy.wait(1300)
    /** Not returned: Cypress would wait for the close() promise, which resolves only after the overlay has left. */
    cy.get('@app').then(() => {
      modal.close()
    })

    /** The content has left after 300ms; the overlay is still fading for another 900ms. */
    cy.wait(700)
    cy.get('.vfm').should('exist')
    cy.get('.vfm').should('not.exist')
  })

  it('open() then close() removes the modal with named transitions', () => {
    const vfm = createVfm()
    const modal = useModal({
      component: VueFinalModal,
      attrs: {
        contentTransition: 'vfm-fade',
        overlayTransition: 'vfm-fade',
      },
      slots: { default: 'Hello World!' },
    })

    cy.mount(App, { global: { plugins: [vfm], stubs: { transition: false } } }).as('app')

    cy.get('@app').then(() => modal.open())
    cy.contains('Hello World!').should('exist')
    cy.get('@app').then(() => modal.close())
    cy.contains('Hello World!').should('not.exist')
  })

  it('settles open() when Esc closes the modal before it finished opening', () => {
    const vfm = createVfm()
    const modal = useModal({ component: VueFinalModal, attrs: fade, slots: { default: 'Hello World!' } })
    const result: { open?: string } = {}

    cy.mount(App, { global: { plugins: [vfm], stubs: { transition: false } } })
    cy.then(() => {
      modal.open().then((value) => {
        result.open = value
      })
    })
    cy.wait(50)
    cy.get('.vfm').trigger('keydown', { key: 'Escape' })
    cy.contains('Hello World!').should('not.exist')
    cy.wrap(result).its('open').should('equal', TOGGLED_AGAIN)
  })

  it('settles close() when open() interrupts the closing', () => {
    const vfm = createVfm()
    const modal = useModal({ component: VueFinalModal, attrs: fade, slots: { default: 'Hello World!' } })
    const result: { close?: string } = {}

    cy.mount(App, { global: { plugins: [vfm], stubs: { transition: false } } })
    cy.then(() => modal.open())
    cy.then(() => {
      modal.close().then((value) => {
        result.close = value
      })
    })
    cy.wait(100)
    cy.then(() => {
      modal.open()
    })
    cy.wrap(result).its('close').should('equal', TOGGLED_AGAIN)
    cy.contains('Hello World!').should('be.visible')
  })
})
