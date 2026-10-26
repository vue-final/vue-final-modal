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

  it('lets layered utilities in the overlay class, such as Tailwind v4 ones, override its background and backdrop filter', () => {
    const style = document.createElement('style')
    style.textContent = '@layer theme, base, components, utilities; @layer utilities { .frosted { background-color: rgb(0 0 0 / 0.4); backdrop-filter: blur(4px); } }'
    document.head.append(style)
    const vfm = createVfm()
    const modal = useModal({
      component: VueFinalModal,
      attrs: { overlayClass: 'frosted' },
      slots: { default: 'Hello World!' },
    })

    cy.mount(App, { global: { plugins: [vfm] } }).as('app')

    cy.get('@app').then(() => modal.open())
    cy.get('.vfm__overlay')
      .should('have.css', 'backdrop-filter', 'blur(4px)')
      .and('have.css', 'background-color', 'rgba(0, 0, 0, 0.4)')
    cy.then(() => style.remove())
  })
})
