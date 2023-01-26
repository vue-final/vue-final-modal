import TestUseModal from './TestUseModal.vue'
import { createVfm, useModal } from '~/index'

describe('Test useModal()', () => {
  it('Should be closed by default', () => {
    const vfm = createVfm()
    cy.mount(TestUseModal, {
      props: {
        run() {
          useModal({
            context: vfm,
            slots: {
              default: 'Hello World!',
            },
          })
        },
      },
      global: { plugins: [vfm] },
    })
    cy.contains('Hello World!').should('not.exist')
  })

  it('Should be opened by given defaultModelValue: true', () => {
    const vfm = createVfm()
    cy.mount(TestUseModal, {
      props: {
        run() {
          useModal({
            context: vfm,
            defaultModelValue: true,
            slots: {
              default: 'Hello World!',
            },
          })
        },
      },
      global: { plugins: [vfm] },
    })

    cy.contains('Hello World!')
  })
})
