import { h, Suspense } from 'vue'
import App from './App.vue'

describe('README example', () => {
  beforeEach(() => {
    /** Suspense holds the page until the async components it renders on mount have loaded, so a dialog shown on mount would appear with the button. */
    cy.mount(() => h(Suspense, null, { default: () => h(App) }))
    cy.contains('button', 'Open dialog')
  })

  it('shows the dialog only after the button is clicked', () => {
    cy.get('dialog').should('not.exist')

    cy.contains('button', 'Open dialog').click()

    cy.get('dialog').within(() => {
      cy.contains('h1', 'Hello World!')
      cy.contains('p', 'This is a dialog content.')
    })
  })

  it('closes the dialog on confirm', () => {
    cy.contains('button', 'Open dialog').click()

    cy.contains('button', 'Confirm').click()

    cy.get('dialog').should('not.exist')
    cy.contains('Confirmed!')
  })

  it('closes the dialog on cancel', () => {
    cy.contains('button', 'Open dialog').click()

    cy.contains('button', 'Cancel').click()

    cy.get('dialog').should('not.exist')
    cy.contains('Confirmed!').should('not.exist')
  })
})
