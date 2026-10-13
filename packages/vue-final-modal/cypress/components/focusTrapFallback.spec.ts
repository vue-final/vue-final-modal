import { createVfm, useModal, VueFinalModal } from '~/index'
import App from './App.vue'

describe('focus trap fallback', () => {
  it('traps focus in the content and closes on Escape when initialFocus matches nothing', () => {
    const vfm = createVfm()
    const modal = useModal({
      component: VueFinalModal,
      attrs: { contentClass: 'modal-content', focusTrap: { initialFocus: '.missing' } },
      slots: { default: '<p>Nothing to focus</p>' },
    })

    cy.mount(App, { global: { plugins: [vfm], stubs: { transition: false } } })
      .then(() => modal.open())
    cy.focused().should('have.class', 'modal-content')

    cy.realPress('Escape')
    cy.get('.modal-content').should('not.exist')
  })
})
