import App from './App.vue'
import { VueFinalModal, createVfm, useModal } from '~/index'

describe('Test useZIndex()', () => {
  it('Props: zIndexFn()', () => {
    const vfm = createVfm()
    const firstModal = useModal({
      component: VueFinalModal,
      attrs: { class: 'first-modal' },
    })

    const secondModal = useModal({
      component: VueFinalModal,
      attrs: { class: 'second-modal' },
    })

    const thirdModal = useModal({
      component: VueFinalModal,
      attrs: { class: 'third-modal' },
    })

    cy.mount(App, {
      global: {
        plugins: [vfm],
        stubs: { transition: false },
      },
    }).as('app')
    cy.get('@app').then(() => {
      firstModal.open()
    })
    cy.get('.first-modal').should(($el) => {
      expect($el).to.have.css('zIndex', '1000')
    })
    cy.get('@app').then(() => {
      secondModal.open()
    })
    cy.get('.second-modal').should(($el) => {
      expect($el).to.have.css('zIndex', '1002')
    })
    cy.get('@app').then(() => {
      thirdModal.open()
    })
    cy.get('.third-modal').should(($el) => {
      expect($el).to.have.css('zIndex', '1004')
    })
    cy.get('@app').then(() => {
      thirdModal.patchOptions({
        attrs: {
          zIndexFn: ({ index }) => 1234 + 2 * index,
        },
      })
    })
    cy.get('.third-modal').should(($el) => {
      expect($el).to.have.css('zIndex', '1238')
    })
    cy.get('@app').then(() => {
      firstModal.close()
    })
    cy.get('.second-modal').should(($el) => {
      expect($el).to.have.css('zIndex', '1000')
    })
    cy.get('.third-modal').should(($el) => {
      expect($el).to.have.css('zIndex', '1236')
    })
  })
})
