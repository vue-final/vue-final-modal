import { defineComponent, h, ref } from 'vue'
import { createTemplateProvider } from '../../src/index'

describe('test useTemplate() options', () => {
  it('showByDefault: false', () => {
    cy.contains('Hello World!').should('not.exist')

    const { TemplateProvider, useTemplate } = createTemplateProvider()

    const ShowByDefault = defineComponent({
      setup() {
        const text = 'Hello World!'
        useTemplate(
          { component: () => h('div', text) },
          { showByDefault: false },
        )
      },
    })
    cy.mount(TemplateProvider, {
      slots: { default: () => h(ShowByDefault) },
    }).as('templateProvider')

    cy.contains('Hello World!').should('not.exist')
  })

  it('showByDefault: true', () => {
    cy.contains('Hello World!').should('not.exist')

    const { TemplateProvider, useTemplate } = createTemplateProvider()

    const ShowByDefault = defineComponent({
      setup() {
        useTemplate(
          { component: () => h('div', 'Hello World!') },
          { showByDefault: true },
        )
      },
    })
    cy.mount(TemplateProvider, {
      slots: { default: () => h(ShowByDefault) },
    }).as('templateProvider')

    cy.contains('Hello World!').should('exist')
  })

  it('hideOnUnmounted: false', () => {
    const { TemplateProvider, useTemplate } = createTemplateProvider()

    const HideOnUnmountedDialog = defineComponent({
      setup() {
        const { show } = useTemplate(
          { component: () => h('div', 'Hello World!') },
          { hideOnUnmounted: false },
        )
        return () => h('button', { onClick: () => show() }, 'Open Modal')
      },
    })

    const HideOnUnmounted = defineComponent({
      setup() {
        const showOnUnmountedDialog = ref(true)
        return () => [
          showOnUnmountedDialog.value ? h(HideOnUnmountedDialog) : null,
          h('button', { onClick: () => showOnUnmountedDialog.value = false }, 'Hide OnUnmountedDialog'),
        ]
      },
    })

    cy.mount(TemplateProvider, {
      slots: { default: () => h(HideOnUnmounted) },
    }).as('templateProvider')

    cy.contains('Hello World!').should('not.exist')

    cy.contains('button', 'Open Modal').click()
    cy.get('@templateProvider').then(() => {
      cy.contains('Hello World!').should('exist')
    })

    cy.contains('button', 'Hide OnUnmountedDialog').click()
    cy.get('@templateProvider').then(() => {
      cy.contains('Hello World!').should('exist')
    })
  })
  it('hideOnUnmounted: true', () => {
    const { TemplateProvider, useTemplate } = createTemplateProvider()

    const HideOnUnmountedDialog = defineComponent({
      setup() {
        const { show } = useTemplate(
          { component: () => h('div', 'Hello World!') },
          { hideOnUnmounted: true },
        )
        return () => h('button', { onClick: () => show() }, 'Open Modal')
      },
    })

    const HideOnUnmounted = defineComponent({
      setup() {
        const showOnUnmountedDialog = ref(true)
        return () => [
          showOnUnmountedDialog.value ? h(HideOnUnmountedDialog) : null,
          h('button', { onClick: () => showOnUnmountedDialog.value = false }, 'Hide OnUnmountedDialog'),
        ]
      },
    })

    cy.mount(TemplateProvider, {
      slots: { default: () => h(HideOnUnmounted) },
    }).as('templateProvider')

    cy.contains('Hello World!').should('not.exist')

    cy.contains('button', 'Open Modal').click()
    cy.get('@templateProvider').then(() => {
      cy.contains('Hello World!').should('exist')
    })

    cy.contains('button', 'Hide OnUnmountedDialog').click()
    cy.get('@templateProvider').then(() => {
      cy.contains('Hello World!').should('not.exist')
    })
  })
})
