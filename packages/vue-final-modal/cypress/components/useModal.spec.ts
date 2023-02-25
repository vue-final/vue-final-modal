import App from './App.vue'
import { createVfm, useModal } from '~/index'

describe('Test useModal()', () => {
  it('Should be closed by default', () => {
    const vfm = createVfm()

    const modal = useModal({
      context: vfm,
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

    cy.mount(App, {
      global: {
        plugins: [vfm],
        stubs: { transition: false },
      },
    })
      .then(() => {
        cy.contains('Hello World!')
      })
  })
})
