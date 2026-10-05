import App from './App.vue'
import Form from './Form.vue'
import { VueFinalModal, createVfm, useModal } from '~/index'

describe('Test focusTrap', () => {
  it('Props: focusTrap', () => {
    const vfm = createVfm()
    const firstModal = useModal({
      component: VueFinalModal,
      attrs: { contentClass: 'first-modal-content' },
      slots: {
        default: Form,
      },
    })

    const secondModal = useModal({
      component: VueFinalModal,
      attrs: { contentClass: 'second-modal-content' },
      slots: {
        default: '<p>Hello world!</p>',
      },
    })

    cy.mount(App, { global: { plugins: [vfm], stubs: { transition: false } } })
      .then(() => firstModal.open())
      .then(() => {
        cy.focused().as('firstModalFocus')
        cy.get('@firstModalFocus').should('have.class', 'first-modal-content')
      })
      .then(() => {
        cy.get('.form-submit').focus()
        cy.focused().as('formSubmitFocus')
        cy.get('@formSubmitFocus').should('have.class', 'form-submit')
      })
      .then(() => secondModal.open())
      .then(() => {
        cy.focused().as('secondModalFocus')
        cy.get('@secondModalFocus').should('have.class', 'second-modal-content')
      })
      .then(() => secondModal.close())
      .then(() => {
        cy.focused().as('formSubmitFocus')
        cy.get('@formSubmitFocus').should('have.class', 'form-submit')
      })
      .then(() => firstModal.close())
      .then(() => firstModal.open())
      .then(() => {
        cy.focused().as('firstModalFocus')
        cy.get('@firstModalFocus').should('have.class', 'first-modal-content')
      })
  })
})
