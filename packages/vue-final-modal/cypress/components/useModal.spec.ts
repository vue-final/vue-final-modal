import VueFinalModal from '~/components/VueFinalModal.vue'
import { createVfm, useModal } from '~/index'
import App from './App.vue'
import Form from './Form.vue'

describe('test useModal()', () => {
  it('should be closed by default', () => {
    const vfm = createVfm()
    const modal = useModal({
      component: VueFinalModal,
      slots: { default: 'Hello World!' },
    })

    cy.mount(App, {
      global: {
        plugins: [vfm],
        stubs: { transition: false },
      },
    }).as('app')

    cy.contains('Hello World!').should('not.exist')
    cy.get('@app').then(() => modal.open())
    cy.contains('Hello World!').should('exist')
    cy.get('@app').then(() => modal.close())
    cy.contains('Hello World!').should('not.exist')
  })

  it('should be opened by given defaultModelValue: true', () => {
    const vfm = createVfm()
    useModal({
      defaultModelValue: true,
      component: VueFinalModal,
      slots: {
        default: 'Hello World!',
      },
    })

    cy.mount(App, {
      global: {
        plugins: [vfm],
        stubs: { transition: false },
      },
    })

    cy.contains('Hello World!')
  })

  it('events', () => {
    const vfm = createVfm()

    const onBeforeOpen = cy.spy().as('onBeforeOpen')
    const onOpened = cy.spy().as('onOpened')
    const onBeforeClose = cy.spy().as('onBeforeClose')
    const onClosed = cy.spy().as('onClosed')

    const modal = useModal({
      component: VueFinalModal,
      attrs: {
        onBeforeOpen,
        onOpened,
        onBeforeClose,
        onClosed,
      },
      slots: { default: Form },
    })

    cy.mount(App, {
      global: {
        plugins: [vfm],
        stubs: { transition: false },
      },
    }).as('app')

    cy.get('@onBeforeOpen').should('have.callCount', 0)
    cy.get('@onOpened').should('have.callCount', 0)
    cy.get('@app').then(() => modal.open())
    cy.get('@onBeforeOpen').should('have.callCount', 1)
    cy.get('@onOpened').should('have.callCount', 1)

    cy.get('@onBeforeClose').should('have.callCount', 0)
    cy.get('@onClosed').should('have.callCount', 0)
    cy.get('@app').then(() => modal.close())
    cy.get('@onBeforeClose').should('have.callCount', 1)
    cy.get('@onClosed').should('have.callCount', 1)
  })
})
