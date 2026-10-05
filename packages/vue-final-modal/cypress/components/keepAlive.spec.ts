import App from './App.vue'
import Form from './Form.vue'
import VueFinalModal from '~/components/VueFinalModal.vue'
import { createVfm, useModal } from '~/index'

describe('Test keepAlive and destroy()', () => {
  it('keepAlive: true keeps the modal mounted and its state after close()', () => {
    const vfm = createVfm()
    const modal = useModal({
      keepAlive: true,
      component: VueFinalModal,
      slots: { default: Form },
    })

    cy.mount(App, { global: { plugins: [vfm], stubs: { transition: false } } }).as('app')

    cy.get('@app').then(() => modal.open())
    cy.get('.form-account').type('hunter')
    cy.get('@app').then(() => modal.close())
    cy.get('.form-account').should('exist')
    cy.get('.form-account').should('not.be.visible')
    cy.get('@app').then(() => modal.open())
    cy.get('.form-account').should('be.visible')
    cy.get('.form-account').should('have.value', 'hunter')
  })

  it('close() without keepAlive unmounts the modal and resets its state', () => {
    const vfm = createVfm()
    const modal = useModal({
      component: VueFinalModal,
      slots: { default: Form },
    })

    cy.mount(App, { global: { plugins: [vfm], stubs: { transition: false } } }).as('app')

    cy.get('@app').then(() => modal.open())
    cy.get('.form-account').type('hunter')
    cy.get('@app').then(() => modal.close())
    cy.get('.form-account').should('not.exist')
    cy.get('@app').then(() => modal.open())
    cy.get('.form-account').should('have.value', '')
  })

  it('destroy() removes an opened modal immediately', () => {
    const vfm = createVfm()
    const modal = useModal({
      component: VueFinalModal,
      slots: { default: Form },
    })

    cy.mount(App, { global: { plugins: [vfm], stubs: { transition: false } } }).as('app')

    cy.get('@app').then(() => modal.open())
    cy.get('.form-account').should('exist')
    cy.get('@app').then(() => modal.destroy())
    cy.get('.form-account').should('not.exist')
  })
})
