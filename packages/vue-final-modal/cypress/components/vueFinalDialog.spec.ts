import { h } from 'vue'
import VueFinalDialog from '~/components/VueFinalDialog.vue'
import { createVfm, ModalsContainer, useModal } from '~/index'

function mountContainer(onOpen?: () => void) {
  cy.mount({
    setup: () => () => [
      h('button', { class: 'open', onClick: onOpen }, 'Open'),
      h(ModalsContainer),
    ],
  }, { global: { plugins: [createVfm()] } })
}

function addStyle(css: string) {
  cy.document().then((doc) => {
    const style = doc.createElement('style')
    style.id = 'dialog-style'
    style.textContent = css
    doc.head.appendChild(style)
  })
}

afterEach(() => {
  cy.document().then((doc) => {
    doc.body.removeAttribute('style')
    doc.getElementById('dialog-style')?.remove()
  })
})

describe('vueFinalDialog', () => {
  it('opens as a modal in the top layer and closes on Esc', () => {
    const modal = useModal({ component: VueFinalDialog, slots: { default: 'Native' } })
    mountContainer()

    cy.then(() => modal.open()).should('equal', 'opened')
    cy.get('dialog').should('have.prop', 'open', true)
    cy.get('dialog').then(([el]) => expect(el.matches(':modal')).to.equal(true))

    cy.realPress('Escape')
    cy.get('dialog').should('not.exist')
  })

  it('closes on a click on the backdrop with closedby any', () => {
    const modal = useModal({ component: VueFinalDialog, attrs: { closedby: 'any' }, slots: { default: 'Light dismiss' } })
    mountContainer()

    cy.then(() => modal.open()).should('equal', 'opened')
    cy.get('body').realClick({ x: 5, y: 5 })
    cy.get('dialog').should('not.exist')
  })

  it('keeps the dialog open on Esc when beforeClose stops it', () => {
    const modal = useModal({ component: VueFinalDialog, attrs: { onBeforeClose: event => event.stop() }, slots: { default: 'Kept' } })
    mountContainer(() => modal.open())

    /** A real click gives the page the user activation the browser asks for before it lets a cancel event be prevented. */
    cy.get('.open').realClick()
    cy.get('dialog').should('have.prop', 'open', true)
    cy.realPress('Escape')
    cy.wait(100)
    cy.get('dialog').should('have.prop', 'open', true)
  })

  it('settles open() and close() after the @starting-style transitions of the dialog', () => {
    addStyle(`
      dialog { opacity: 1; transition: opacity .4s, overlay .4s allow-discrete, display .4s allow-discrete; }
      dialog:not([open]) { opacity: 0; }
      @starting-style { dialog[open] { opacity: 0; } }
    `)
    const modal = useModal({ component: VueFinalDialog, slots: { default: 'Fading' } })
    mountContainer()

    let startedAt = 0
    cy.then(() => {
      startedAt = performance.now()
      return modal.open()
    }).should('equal', 'opened')
    cy.then(() => expect(performance.now() - startedAt).to.be.greaterThan(350))

    cy.then(() => {
      startedAt = performance.now()
      const closed = modal.close()
      expect(Cypress.$('dialog')).to.have.length(1)
      return closed
    }).should('equal', 'closed')
    cy.then(() => expect(performance.now() - startedAt).to.be.greaterThan(350))
    cy.get('dialog').should('not.exist')
  })

  it('locks the page scroll while open with lockScroll', () => {
    const modal = useModal({ component: VueFinalDialog, attrs: { lockScroll: true }, slots: { default: 'Locked' } })
    mountContainer()

    cy.then(() => modal.open()).should('equal', 'opened')
    cy.document().its('body.style.overflowY').should('equal', 'hidden')
    cy.realPress('Escape')
    cy.get('dialog').should('not.exist')
    cy.document().its('body.style.overflowY').should('equal', '')
  })
})
