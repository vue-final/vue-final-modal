import App from './App.vue'
import Form from './Form.vue'
import { createVfm, useModal } from '~/index'

describe('Test useModal()', () => {
  it('Should be closed by default', () => {
    const vfm = createVfm()
    const modal = useModal({
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
  })

  it('Should be opened by given defaultModelValue: true', () => {
    const vfm = createVfm()
    useModal({
      defaultModelValue: true,
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

  it('Events', () => {
    const vfm = createVfm()

    const onBeforeOpen = cy.spy().as('onBeforeOpen')
    const onOpened = cy.spy().as('onOpened')
    const onBeforeClose = cy.spy().as('onBeforeClose')
    const onClosed = cy.spy().as('onClosed')

    const modal = useModal({
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
