import VueFinalModal from '~/components/VueFinalModal.vue'
import { createVfm, useModal } from '~/index'
import App from './App.vue'

/** Per frame: the visibility of every fixed ancestor of the overlay, then of the root, overlay and content. */
function visibilitiesFor(ms: number) {
  return new Cypress.Promise<string[]>((resolve) => {
    const seen = new Set<string>()
    const end = performance.now() + ms
    requestAnimationFrame(function sample() {
      const overlay = document.querySelector<HTMLElement>('.vfm__overlay')
      if (overlay) {
        const fixedAncestors: string[] = []
        for (let el = overlay.parentElement; el; el = el.parentElement) {
          if (getComputedStyle(el).position === 'fixed')
            fixedAncestors.push(getComputedStyle(el).visibility)
        }
        const layers = ['.vfm', '.vfm__overlay', '.vfm__content'].map(selector => getComputedStyle(document.querySelector(selector)!).visibility)
        seen.add(`fixed: ${fixedAncestors.join(' ')} | layers: ${layers.join(' ')}`)
      }
      if (performance.now() < end)
        requestAnimationFrame(sample)
      else
        resolve([...seen])
    })
  })
}

describe('the status bar of an iOS home screen web app', () => {
  /** iOS 26 colors it from the visible fixed element at the top edge; like a native dialog's ::backdrop, the modal must never be one. */
  it('finds no visible fixed ancestor of the overlay while the modal opens, stays open and closes', () => {
    const vfm = createVfm()
    const modal = useModal({
      component: VueFinalModal,
      attrs: { overlayTransition: 'vfm-slide-down', contentTransition: 'vfm-slide-down' },
      slots: { default: 'Hello World!' },
    })

    cy.mount(App, { global: { plugins: [vfm], stubs: { transition: false } } }).as('app')

    cy.get('@app').then(() => {
      modal.open()
      return visibilitiesFor(500)
    }).should('deep.equal', ['fixed: hidden | layers: visible visible visible'])

    cy.get('@app').then(() => {
      modal.close()
      return visibilitiesFor(250)
    }).should('deep.equal', ['fixed: hidden | layers: visible visible visible'])
  })
})
