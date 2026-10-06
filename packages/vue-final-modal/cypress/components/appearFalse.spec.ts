import App from './App.vue'
import VueFinalModal from '~/components/VueFinalModal.vue'
import { createVfm, useModal } from '~/index'

describe('Transitions without appear', () => {
  it('still opens, resolves open() and emits opened once', () => {
    const vfm = createVfm()
    const onOpened = cy.spy().as('onOpened')
    const modal = useModal({
      component: VueFinalModal,
      attrs: {
        contentTransition: { name: 'vfm-fade', appear: false },
        overlayTransition: { name: 'vfm-fade', appear: false },
        onOpened,
      },
      slots: { default: 'Opened without appear' },
    })

    cy.mount(App, { global: { plugins: [vfm], stubs: { transition: false } } }).as('app')

    cy.get('@app').then(() => modal.open())
    cy.contains('Opened without appear').should('be.visible')
    cy.get('@onOpened').should('have.callCount', 1)
  })
})
