import { ModalsContainer, createVfm, useModal } from '~/index'

describe('Test ModalsContainer', () => {
  it('Should not warn about attrs it cannot inherit', () => {
    const warn = cy.spy(console, 'warn').as('warn')
    const vfm = createVfm()
    const modal = useModal({
      slots: { default: 'Hello World!' },
    })

    cy.mount(ModalsContainer, {
      attrs: { 'data-v-inspector': 'app.vue:1:1' },
      global: {
        plugins: [vfm],
        stubs: { transition: false },
      },
    }).then(() => modal.open())

    cy.contains('Hello World!').then(() => {
      expect(warn).not.to.have.been.calledWithMatch(/Extraneous non-props attributes/)
    })
  })
})
