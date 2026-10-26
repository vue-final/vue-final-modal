import VueFinalModal from '~/components/VueFinalModal.vue'
import { createVfm, useModal } from '~/index'
import App from './App.vue'

function overlayBackdropFiltersFor(ms: number) {
  return new Cypress.Promise<string[]>((resolve) => {
    const seen = new Set<string>()
    const end = performance.now() + ms
    requestAnimationFrame(function sample() {
      const overlay = document.querySelector<HTMLElement>('.vfm__overlay')
      if (overlay)
        seen.add(getComputedStyle(overlay).backdropFilter)
      if (performance.now() < end)
        requestAnimationFrame(sample)
      else
        resolve([...seen])
    })
  })
}

describe('the status bar of an iOS home screen web app', () => {
  /** iOS 26 colors it from a fixed overlay at the top edge, but not from one with a backdrop filter, just as it never does from a native dialog's ::backdrop. */
  it('gives the overlay a backdrop filter while the modal opens, stays open and closes', () => {
    const vfm = createVfm()
    const modal = useModal({
      component: VueFinalModal,
      attrs: { overlayTransition: 'vfm-slide-down', contentTransition: 'vfm-slide-down' },
      slots: { default: 'Hello World!' },
    })

    cy.mount(App, { global: { plugins: [vfm], stubs: { transition: false } } }).as('app')

    cy.get('@app').then(() => {
      modal.open()
      return overlayBackdropFiltersFor(500)
    }).should('deep.equal', ['blur(0px)'])

    cy.get('@app').then(() => {
      modal.close()
      return overlayBackdropFiltersFor(250)
    }).should('deep.equal', ['blur(0px)'])
  })

  it('keeps the backdrop filter of the overlay class', () => {
    const style = document.createElement('style')
    style.textContent = '.frosted { backdrop-filter: blur(4px); }'
    document.head.append(style)
    const vfm = createVfm()
    const modal = useModal({
      component: VueFinalModal,
      attrs: { overlayClass: 'frosted' },
      slots: { default: 'Hello World!' },
    })

    cy.mount(App, { global: { plugins: [vfm] } }).as('app')

    cy.get('@app').then(() => modal.open())
    cy.get('.vfm__overlay').should('have.css', 'backdrop-filter', 'blur(4px)')
    cy.then(() => style.remove())
  })
})
