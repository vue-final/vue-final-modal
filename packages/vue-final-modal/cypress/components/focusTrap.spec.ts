import { h } from 'vue'
import App from './App.vue'
import Form from './Form.vue'
import { VueFinalModal, createVfm, useModal } from '~/index'

describe('Test focusTrap', () => {
  it('keeps letting clicks reach an interactive background when other focus-trap options are passed', () => {
    const vfm = createVfm()
    const behind = { clicks: 0 }
    cy.mount({
      setup: () => () => [
        h('button', { class: 'behind', style: 'position: fixed; right: 10px; bottom: 10px', onClick: () => behind.clicks++ }, 'Behind'),
        h(VueFinalModal, {
          modelValue: true,
          background: 'interactive',
          teleportTo: false,
          focusTrap: { delayInitialFocus: false },
        }, () => 'content'),
      ],
    }, { global: { plugins: [vfm], stubs: { transition: false } } })

    cy.focused().should('have.class', 'vfm__content')
    cy.get('.behind').click()
    cy.wrap(behind).its('clicks').should('equal', 1)
  })

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

  it('keeps trapping focus after Escape when escToClose is false', () => {
    const vfm = createVfm()
    const modal = useModal({
      component: VueFinalModal,
      attrs: { contentClass: 'modal-content', escToClose: false },
      slots: {
        default: Form,
      },
    })

    cy.mount(App, { global: { plugins: [vfm], stubs: { transition: false } } })
      .then(() => modal.open())
    cy.focused().should('have.class', 'modal-content')

    cy.realPress('Escape')
    cy.get('.modal-content').should('exist')

    cy.realPress('Tab')
    cy.focused().should('have.class', 'form-account')
    cy.realPress('Tab')
    cy.focused().should('have.class', 'form-password')
    cy.realPress('Tab')
    cy.focused().should('have.class', 'form-submit')
    cy.realPress('Tab')
    cy.focused().should('have.class', 'modal-content')
  })
})
