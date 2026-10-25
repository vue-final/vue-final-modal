import VueFinalModal from '~/components/VueFinalModal.vue'
import { createVfm, useModal } from '~/index'
import App from './App.vue'

function visibilitiesWhileLeaving() {
  return new Cypress.Promise<string[]>((resolve) => {
    const seen = new Set<string>()
    const end = performance.now() + 250
    requestAnimationFrame(function sample() {
      const root = document.querySelector<HTMLElement>('.vfm')
      const layers = [...document.querySelectorAll<HTMLElement>('.vfm__overlay, .vfm__content')]
      if (root && layers.some(layer => layer.getAnimations().length))
        seen.add([root, ...layers].map(el => getComputedStyle(el).visibility).join(' '))
      if (performance.now() < end)
        requestAnimationFrame(sample)
      else
        resolve([...seen])
    })
  })
}

describe('a leaving modal', () => {
  /** iOS 26 colors the status bar from the visible fixed root, and keeps that color until the root is gone. */
  it('hides its root and keeps its layers visible while it leaves', () => {
    const vfm = createVfm()
    const modal = useModal({
      component: VueFinalModal,
      attrs: { overlayTransition: 'vfm-slide-down', contentTransition: 'vfm-slide-down' },
      slots: { default: 'Hello World!' },
    })

    cy.mount(App, { global: { plugins: [vfm], stubs: { transition: false } } }).as('app')

    cy.get('@app').then(() => modal.open())
    cy.get('.vfm').should('have.css', 'visibility', 'visible')

    cy.get('@app').then(() => {
      modal.close()
      return visibilitiesWhileLeaving()
    }).should('deep.equal', ['hidden visible visible'])
  })
})
