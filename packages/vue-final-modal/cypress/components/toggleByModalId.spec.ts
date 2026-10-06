import { h } from 'vue'
import VueFinalModal from '~/components/VueFinalModal.vue'
import { createVfm } from '~/index'

function mountModal(modalId: string, onOpened: () => void) {
  const vfm = createVfm()
  cy.mount({ render: () => h(VueFinalModal, { modalId, onOpened }, () => `Hello ${modalId}`) }, {
    global: { plugins: [vfm], stubs: { transition: false } },
  })
  return vfm
}

describe('vfm.open(), close() and toggle() by modalId', () => {
  it('resolve once the modal has opened or closed', () => {
    const vfm = mountModal('by-id', cy.spy().as('onOpened'))

    cy.wrap(null).then(() => vfm.open('by-id')).should('eq', 'opened')
    cy.contains('Hello by-id').should('be.visible')
    cy.wrap(null).then(() => vfm.close('by-id')).should('eq', 'closed')
    cy.contains('Hello by-id').should('not.exist')
    cy.wrap(null).then(() => vfm.toggle('by-id')).should('eq', 'opened')
    cy.get('@onOpened').should('have.callCount', 2)
  })

  it('resolves close() with closed and emits opened once when closing right after opening', () => {
    const vfm = mountModal('race', cy.spy().as('onOpened'))

    cy.wrap(null).then(() => vfm.open('race')!.then(() => vfm.close('race'))).should('eq', 'closed')
    cy.get('@onOpened').should('have.callCount', 1)
  })
})
