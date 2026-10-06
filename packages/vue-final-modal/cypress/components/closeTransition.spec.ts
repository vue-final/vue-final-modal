import App from './App.vue'
import VueFinalModal from '~/components/VueFinalModal.vue'
import { createVfm, useModal } from '~/index'
import '../../dist/style.css'

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
})
