import { ModalsContainer, createVfm, useModal } from '~/index'

describe('Test useModal()', () => {
  it('Should be closed by default', () => {
    const vfm = createVfm()

    const modal = useModal({
      context: vfm,
      slots: {
        default: 'Hello World!',
      },
    })

    cy.mount(ModalsContainer, {
      global: { plugins: [vfm] },
    })
      .then(() => {
        cy.contains('Hello World!').should('not.exist')
      })
      .then(() => {
        modal.open()
        cy.contains('Hello World!').should('exist')
      })
  })

  it('Should be opened by given defaultModelValue: true', () => {
    const vfm = createVfm()

    useModal({
      context: vfm,
      defaultModelValue: true,
      slots: {
        default: 'Hello World!',
      },
    })

    cy.mount(ModalsContainer, {
      global: { plugins: [vfm] },
    })
      .then(() => {
        cy.contains('Hello World!')
      })
  })
})
