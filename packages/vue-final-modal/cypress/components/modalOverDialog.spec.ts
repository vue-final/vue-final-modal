import type { ComponentProps } from '~/types'
import { h } from 'vue'
import VueFinalDialog from '~/components/VueFinalDialog.vue'
import VueFinalModal from '~/components/VueFinalModal.vue'
import { createVfm, ModalsContainer, useModal } from '~/index'

let clicks = 0

function mountContainer() {
  cy.mount({ setup: () => () => h(ModalsContainer) }, { global: { plugins: [createVfm()] } })
}

function useDialog(name: string, onClick?: () => void) {
  return useModal({ component: VueFinalDialog, attrs: { class: name }, slots: { default: () => h('button', { class: `${name}-button`, onClick }, name) } })
}

function useConfirm(attrs: Partial<ComponentProps<typeof VueFinalModal>> = {}) {
  return useModal({
    component: VueFinalModal,
    attrs: { contentClass: 'confirm', ...attrs },
    slots: { default: () => h('button', { class: 'confirm-button', onClick: () => clicks++ }, 'Confirm') },
  })
}

beforeEach(() => {
  clicks = 0
})

describe('a VueFinalModal opened over a VueFinalDialog', () => {
  it('is moved into the dialog, where it can be clicked', () => {
    const dialog = useDialog('first')
    const confirm = useConfirm()
    mountContainer()

    cy.then(() => dialog.open()).should('equal', 'opened')
    cy.then(() => confirm.open()).should('equal', 'opened')
    cy.get('dialog.first .confirm').should('exist')
    cy.get('.confirm-button').realClick()
    cy.then(() => expect(clicks).to.equal(1))
  })

  /** Opened by a click, as a confirm in a dialog is: without a user activation since, the browser closes the dialog on Esc whatever the page does. */
  it('closes alone on Esc, and the dialog closes on the next Esc', () => {
    const confirm = useConfirm()
    const dialog = useDialog('first', () => confirm.open())
    mountContainer()

    cy.then(() => dialog.open()).should('equal', 'opened')
    cy.get('.first-button').realClick()
    cy.get('.confirm').should('be.visible')
    /** Esc reaches the modal that has the focus, which its focus trap moves in a frame after it opened. */
    cy.focused().should('match', '.vfm *')

    cy.realPress('Escape')
    cy.get('.confirm').should('not.exist')
    cy.wait(100)
    cy.get('dialog.first').should('have.prop', 'open', true)

    /** A click on the dialog itself gives the user activation; its button would open the confirm again. */
    cy.get('dialog.first').realClick({ position: 'topLeft' })
    cy.get('.confirm').should('not.exist')
    cy.realPress('Escape')
    cy.get('dialog.first').should('not.exist')
  })

  it('keeps the dialog open on Esc with escToClose false', () => {
    const confirm = useConfirm({ escToClose: false })
    const dialog = useDialog('first', () => confirm.open())
    mountContainer()

    cy.then(() => dialog.open()).should('equal', 'opened')
    cy.get('.first-button').realClick()
    cy.get('.confirm').should('be.visible')
    /** Esc reaches the modal that has the focus, which its focus trap moves in a frame after it opened. */
    cy.focused().should('match', '.vfm *')

    cy.realPress('Escape')
    cy.wait(100)
    cy.get('.confirm').should('be.visible')
    cy.get('dialog.first').should('have.prop', 'open', true)
  })

  it('is moved into the topmost of two dialogs', () => {
    const first = useDialog('first')
    const second = useDialog('second')
    const confirm = useConfirm()
    mountContainer()

    cy.then(() => first.open()).should('equal', 'opened')
    cy.then(() => second.open()).should('equal', 'opened')
    cy.then(() => confirm.open()).should('equal', 'opened')
    cy.get('dialog.second .confirm').should('exist')
    cy.get('.confirm-button').realClick()
    cy.then(() => expect(clicks).to.equal(1))
  })

  it('goes back to the body once the dialog has closed', () => {
    const dialog = useDialog('first')
    const confirm = useConfirm()
    mountContainer()

    cy.then(() => dialog.open()).should('equal', 'opened')
    cy.then(() => confirm.open()).should('equal', 'opened')
    cy.then(() => confirm.close()).should('equal', 'closed')
    cy.then(() => dialog.close()).should('equal', 'closed')

    cy.then(() => confirm.open()).should('equal', 'opened')
    cy.get('body > .vfm-shell .confirm').should('exist')
  })

  it('stays where it is rendered with teleportTo false', () => {
    const dialog = useDialog('first')
    const confirm = useConfirm({ teleportTo: false })
    mountContainer()

    cy.then(() => dialog.open()).should('equal', 'opened')
    cy.then(() => confirm.open()).should('equal', 'opened')
    cy.get('.confirm').should('exist')
    cy.get('dialog .confirm').should('not.exist')
  })
})
