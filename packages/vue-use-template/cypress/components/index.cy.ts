import { h } from 'vue'
import { TemplateProvider, useTemplate } from '../../src/index'

describe('test useTemplate()', () => {
  it('hello world - basic useTemplate', () => {
    cy.mount(TemplateProvider).as('templateProvider')

    const text = 'Hello World!'
    const { show, hide } = useTemplate({ component: () => h('div', text) })

    cy.get('@templateProvider').then(() => show())
    cy.contains(text).should('exist')

    cy.get('@templateProvider').then(() => hide())
    cy.contains(text).should('not.exist')
  })
})
