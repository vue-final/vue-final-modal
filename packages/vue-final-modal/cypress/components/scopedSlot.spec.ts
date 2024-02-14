import App from './App.vue'
import ModalCloseByScopedSlot from './ModalCloseByScopedSlot.vue'
import { createVfm, useModal } from '~/index'

describe('Test scopedSlot', () => {
  it('close() scoped slot ', () => {
    const vfm = createVfm()
    const modalName = 'modal-close-by-scoped-slot'
    useModal({
      defaultModelValue: true,
      component: ModalCloseByScopedSlot,
      attrs: { class: modalName },
    })

    cy.mount(App, {
      global: {
        plugins: [vfm],
        stubs: { transition: false },
      },
    }).as('app')

    cy.get(`.${modalName}`).should('exist')
    cy.get(`.${modalName}`).find('button').click()
    cy.get(`.${modalName}`).should('not.exist')
  })
})
