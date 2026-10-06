import App from './App.vue'
import VueFinalModal from '~/components/VueFinalModal.vue'
import { createVfm, useModal } from '~/index'

/** Checks the overlay's own styles, not Cypress visibility: a covered modal's overlay sits under the top modal, which is not the same as hidden. */
function expectOverlay(rootSelector: string, shown: boolean) {
  cy.get(rootSelector).should(($root) => {
    const overlay = $root.find('.vfm__overlay')[0]
    const style = overlay && getComputedStyle(overlay)
    const isShown = !!style && style.display !== 'none' && style.visibility !== 'hidden'
    expect(isShown, `${rootSelector} overlay shown`).to.equal(shown)
  })
}

function mountTwo(firstAttrs: Record<string, unknown> = {}) {
  const vfm = createVfm()
  const first = useModal({ component: VueFinalModal, attrs: { class: 'first', ...firstAttrs }, slots: { default: 'First' } })
  const second = useModal({ component: VueFinalModal, attrs: { class: 'second' }, slots: { default: 'Second' } })
  cy.mount(App, { global: { plugins: [vfm], stubs: { transition: false } } }).as('app')
  return { first, second }
}

describe('Props: overlayBehavior and hideOverlay', () => {
  it('"auto" shows only the overlay of the top modal', () => {
    const { first, second } = mountTwo()

    cy.get('@app').then(() => first.open())
    expectOverlay('.first', true)
    cy.get('@app').then(() => second.open())
    expectOverlay('.first', false)
    expectOverlay('.second', true)
    cy.get('@app').then(() => second.close())
    cy.get('.second').should('not.exist')
    expectOverlay('.first', true)
  })

  it('"persist" keeps the overlay of a covered modal', () => {
    const { first, second } = mountTwo({ overlayBehavior: 'persist' })

    cy.get('@app').then(() => first.open())
    cy.get('@app').then(() => second.open())
    expectOverlay('.first', true)
    expectOverlay('.second', true)
  })

  it('hideOverlay renders no overlay for that modal only', () => {
    const { first, second } = mountTwo({ hideOverlay: true })

    cy.get('@app').then(() => first.open())
    cy.get('@app').then(() => second.open())
    expectOverlay('.first', false)
    expectOverlay('.second', true)
  })
})
