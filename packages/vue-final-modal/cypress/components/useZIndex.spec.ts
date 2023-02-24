import { ModalsContainer, VueFinalModal, createVfm, useModal } from '~/index'

describe('Test useZIndex()', () => {
  it('Props: zIndexFn()', () => {
    const vfm = createVfm()
    const firstModal = useModal({
      context: vfm,
      component: VueFinalModal,
      attrs: { class: 'first-modal' },
    })

    const secondModal = useModal({
      context: vfm,
      component: VueFinalModal,
      attrs: { class: 'second-modal' },
    })

    const thirdModal = useModal({
      context: vfm,
      component: VueFinalModal,
      attrs: { class: 'third-modal' },
    })

    cy.mount(ModalsContainer, {
      global: { plugins: [vfm] },
    })
      .then(() => {
        firstModal.open()
        cy.get('.first-modal').should(($el) => {
          expect($el).to.have.css('zIndex', '1000')
        })
      })
      .then(() => {
        secondModal.open()
        cy.get('.second-modal').should(($el) => {
          expect($el).to.have.css('zIndex', '1002')
        })
      })
      .then(() => {
        thirdModal.open()
        cy.get('.third-modal').should(($el) => {
          expect($el).to.have.css('zIndex', '1004')
        })
      })
      .then(() => {
        thirdModal.patchOptions({
          attrs: {
            zIndexFn: ({ index }) => 1234 + 2 * index,
          },
        })
        cy.get('.third-modal').should(($el) => {
          expect($el).to.have.css('zIndex', '1238')
        })
      })
      .then(() => {
        firstModal.close()
        cy.get('.second-modal').should(($el) => {
          expect($el).to.have.css('zIndex', '1000')
        })
        cy.get('.third-modal').should(($el) => {
          expect($el).to.have.css('zIndex', '1236')
        })
      })
  })
})
