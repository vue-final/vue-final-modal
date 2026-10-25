import VueFinalModal from '~/components/VueFinalModal.vue'
import { createVfm, useModal } from '~/index'
import App from './App.vue'

function overlayOpacitiesWhileAnimating() {
  return new Cypress.Promise<string[]>((resolve) => {
    const opacities: string[] = []
    const end = performance.now() + 250
    requestAnimationFrame(function sample() {
      const overlay = document.querySelector<HTMLElement>('.vfm__overlay')
      if (overlay?.getAnimations().length)
        opacities.push(getComputedStyle(overlay).opacity)
      if (performance.now() < end)
        requestAnimationFrame(sample)
      else
        resolve(opacities)
    })
  })
}

describe('vfm-fade on the overlay', () => {
  /** iOS 26 colors the status bar from the overlay when it is inserted, and skips an overlay whose own opacity is below 0.1 until the fade ends. */
  it('keeps the overlay opacity at 1 while it fades in and out', () => {
    const vfm = createVfm()
    const modal = useModal({
      component: VueFinalModal,
      attrs: { overlayTransition: 'vfm-fade' },
      slots: { default: 'Hello World!' },
    })

    cy.mount(App, { global: { plugins: [vfm], stubs: { transition: false } } }).as('app')

    cy.get('@app').then(() => {
      modal.open()
      return overlayOpacitiesWhileAnimating()
    }).should((opacities) => {
      expect(opacities).not.to.be.empty
      expect([...new Set(opacities)]).to.deep.equal(['1'])
    })

    cy.get('@app').then(() => {
      modal.close()
      return overlayOpacitiesWhileAnimating()
    }).should((opacities) => {
      expect(opacities).not.to.be.empty
      expect([...new Set(opacities)]).to.deep.equal(['1'])
    })
  })
})
