const mismatch = 'Hydration completed but contains mismatches.'

interface NuxtRoot extends HTMLElement {
  __vue_app__: { $nuxt: { isHydrating: boolean } }
}

function serverHtml(path: string) {
  return cy.request(path).its('body')
}

function hydrate(path: string) {
  cy.visit(path, {
    onBeforeLoad(win) {
      cy.spy(win.console, 'error').as('consoleError')
    },
  })
  cy.get<NuxtRoot>('#__nuxt').should(([root]) => {
    expect(root.__vue_app__.$nuxt.isHydrating).to.equal(false)
  })
}

describe('vue-use-template in Nuxt SSR', () => {
  it('renders a template shown in page setup into the server HTML', () => {
    serverHtml('/ssr/setup').should('contain', 'Shown in page setup')
    hydrate('/ssr/setup')
    cy.contains('dialog', 'Shown in page setup')
    cy.get('@consoleError').should('not.have.been.calledWith', mismatch)
  })

  it('renders a template shown after an await in page setup on the client only', () => {
    serverHtml('/ssr/after-await').should('not.contain', 'Shown after an await')
    hydrate('/ssr/after-await')
    cy.contains('dialog', 'Shown after an await')
    cy.get('@consoleError').should('not.have.been.calledWith', mismatch)
  })

  it('renders a template shown in page setup with data prefetched in route middleware into the server HTML', () => {
    serverHtml('/ssr/prefetched').should('contain', 'Shown with prefetched data')
    hydrate('/ssr/prefetched')
    cy.contains('dialog', 'Shown with prefetched data')
    cy.get('@consoleError').should('not.have.been.calledWith', mismatch)
  })

  it('renders a template shown in route middleware on the client only, after hydration', () => {
    serverHtml('/ssr/middleware').should('not.contain', 'Shown in route middleware')
    hydrate('/ssr/middleware')
    cy.contains('dialog', 'Shown in route middleware')
    cy.get('@consoleError').should('not.have.been.calledWith', mismatch)
  })

  it('renders a template shown in a plugin on the client only, after hydration', () => {
    serverHtml('/ssr/plugin').should('not.contain', 'Shown in a plugin')
    hydrate('/ssr/plugin')
    cy.contains('dialog', 'Shown in a plugin')
    cy.get('@consoleError').should('not.have.been.calledWith', mismatch)
  })

  describe('known hydration mismatches', () => {
    it('renders a template shown in a lazy component into the server HTML once loaded, before the client has loaded it', () => {
      cy.request('/ssr/lazy')
      serverHtml('/ssr/lazy').should('contain', 'Shown in a lazy component')
      hydrate('/ssr/lazy')
      cy.contains('dialog', 'Shown in a lazy component')
      cy.get('@consoleError').should('have.been.calledWith', mismatch)
    })
  })
})
