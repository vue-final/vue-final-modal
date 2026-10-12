import { defineComponent, h } from 'vue'
import { createVfm, useModal, useModalSlot, VueFinalModal } from '~/index'
import App from './App.vue'

/** Long enough to act while the modal on top is still fading out. */
const slow = { name: 'vfm-fade', duration: 1200 }

function mountStackedModals(options: { background?: 'interactive' } = {}) {
  const vfm = createVfm()
  const clicks: string[] = []
  const BelowButton = defineComponent({
    render: () => h('button', { class: 'below-button', onClick: () => clicks.push('below') }, 'Below'),
  })
  const below = useModal({
    component: VueFinalModal,
    attrs: { contentStyle: 'position: absolute; top: 40px; left: 40px;' },
    slots: { default: useModalSlot({ component: BelowButton }) },
  })
  const above = useModal({
    component: VueFinalModal,
    attrs: {
      ...options,
      contentClass: 'above-content',
      contentStyle: 'position: absolute; inset: 0; background: white;',
      contentTransition: slow,
      overlayTransition: slow,
    },
    slots: { default: 'Above' },
  })

  cy.mount(App, { global: { plugins: [vfm], stubs: { transition: false } } }).as('app')
  cy.get('@app').then(() => below.open())
  cy.get('.below-button').should('be.visible')
  cy.get('@app').then(() => above.open())
  return { above, clicks }
}

function hitAtBelowButton() {
  return cy.get('.below-button').then(($button) => {
    const rect = $button[0].getBoundingClientRect()
    return $button[0].ownerDocument.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)
  })
}

describe('a modal that is leaving', () => {
  it('lets a click during its leave reach the modal underneath', () => {
    const { above, clicks } = mountStackedModals()

    cy.get('@app').then(() => {
      above.close()
    })
    cy.wait(300)
    cy.get('.above-content').should('exist')
    hitAtBelowButton().should('have.class', 'below-button')
    cy.get('.below-button').realClick()
    cy.wrap(clicks).should('deep.equal', ['below'])
    cy.get('.above-content').should('not.exist')
  })

  it('lets a click during its leave reach the modal underneath with an interactive background', () => {
    const { above, clicks } = mountStackedModals({ background: 'interactive' })

    cy.get('@app').then(() => {
      above.close()
    })
    cy.wait(300)
    cy.get('.above-content').should('exist')
    hitAtBelowButton().should('have.class', 'below-button')
    cy.get('.below-button').realClick()
    cy.wrap(clicks).should('deep.equal', ['below'])
  })

  it('takes pointer events again when it opens before its leave ends', () => {
    const { above, clicks } = mountStackedModals()

    cy.get('@app').then(() => {
      above.close()
    })
    cy.wait(300)
    cy.get('@app').then(() => {
      above.open()
    })
    cy.wait(100)
    hitAtBelowButton().then(hit => expect(hit?.closest('.above-content')).to.exist)
    cy.get('.below-button').realClick()
    cy.wrap(clicks).should('deep.equal', [])
  })
})
