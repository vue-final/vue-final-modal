import type { Ref } from 'vue'
import type { Template } from '../../src/index'
import type DialogConfirm from './DialogConfirm.vue'
import { defineAsyncComponent, defineComponent, h, markRaw, reactive, ref } from 'vue'
import { createTemplateProvider, defineTemplate } from '../../src/index'

describe('test useTemplate()', () => {
  it('hello world - basic useTemplate', () => {
    const { TemplateProvider, useTemplate } = createTemplateProvider()

    cy.mount(TemplateProvider).as('templateProvider')

    const text = 'Hello World!'
    const { show, hide } = useTemplate({ component: () => h('div', text) })

    cy.get('@templateProvider').then(() => show())
    cy.contains(text).should('exist')

    cy.get('@templateProvider').then(() => hide())
    cy.contains(text).should('not.exist')
  })

  it('DialogConfirm - given static attrs', () => {
    const { TemplateProvider, useTemplate } = createTemplateProvider()

    cy.mount(TemplateProvider).as('templateProvider')

    const title = 'Hello World!'
    const content = 'This is a dialog content.'
    const onConfirm = cy.spy().as('onConfirm')
    const onCancel = cy.spy().as('onCancel')

    const { show, hide } = useTemplate({
      component: defineAsyncComponent(() => import('./DialogConfirm.vue')),
      attrs: {
        title,
        onConfirm: () => {
          onConfirm()
          hide()
        },
        onCancel: () => {
          onCancel()
          hide()
        },
      },
      slots: {
        default: defineTemplate({ component: () => h('p', content) }),
      },
    })

    /** Confirm */
    cy.get('@templateProvider').then(() => show())
    cy.get('dialog').should('exist')
    cy.contains(title)
    cy.contains('p', content)
    cy.contains('button', 'Confirm').click()
    cy.get('@templateProvider').then(() => {
      cy.get('dialog').should('not.exist')
    })
    cy.get('@onConfirm').should('have.callCount', 1)

    /** Cancel */
    cy.get('@templateProvider').then(() => show())
    cy.get('dialog').should('exist')
    cy.contains('button', 'Cancel').click()
    cy.get('@templateProvider').then(() => {
      cy.get('dialog').should('not.exist')
    })
    cy.get('@onCancel').should('have.callCount', 1)
  })

  it('DialogConfirm - given ref props', () => {
    const { TemplateProvider, useTemplate } = createTemplateProvider()

    cy.mount(TemplateProvider).as('templateProvider')

    const props = ref({ title: 'Hello World!' })
    const content = 'This is a dialog content.'
    const onConfirm = cy.spy().as('onConfirm')
    const onCancel = cy.spy().as('onCancel')

    const { show, hide } = useTemplate({
      component: defineAsyncComponent(() => import('./DialogConfirm.vue')),
      props,
      emits: {
        onConfirm: () => {
          onConfirm()
          hide()
        },
        onCancel: () => {
          onCancel()
          hide()
        },
      },
      slots: {
        default: defineTemplate({ component: () => h('p', content) }),
      },
    })

    /** Confirm */
    cy.get('@templateProvider').then(() => show())
    cy.get('dialog').should('exist')
    cy.contains(props.value.title)
    cy.contains('p', content)
    cy.get('@templateProvider').then(() => {
      props.value.title = 'Title Changed!'
    })
    cy.get('@templateProvider').then(() => {
      cy.contains('Title Changed!')
    })

    cy.contains('button', 'Confirm').click()
    cy.get('@templateProvider').then(() => {
      cy.get('dialog').should('not.exist')
    })
    cy.get('@onConfirm').should('have.callCount', 1)

    /** Cancel */
    cy.get('@templateProvider').then(() => show())
    cy.get('dialog').should('exist')
    cy.contains('button', 'Cancel').click()
    cy.get('@templateProvider').then(() => {
      cy.get('dialog').should('not.exist')
    })
    cy.get('@onCancel').should('have.callCount', 1)
  })

  it('DialogConfirm - given reactive props', () => {
    const { TemplateProvider, useTemplate } = createTemplateProvider()

    cy.mount(TemplateProvider).as('templateProvider')

    const props = reactive({ title: 'Hello World!' })
    const content = 'This is a dialog content.'
    const onConfirm = cy.spy().as('onConfirm')
    const onCancel = cy.spy().as('onCancel')

    const { show, hide } = useTemplate({
      component: defineAsyncComponent(() => import('./DialogConfirm.vue')),
      props,
      emits: {
        onConfirm: () => {
          onConfirm()
          hide()
        },
        onCancel: () => {
          onCancel()
          hide()
        },
      },
      slots: {
        default: defineTemplate({ component: () => h('p', content) }),
      },
    })

    /** Confirm */
    cy.get('@templateProvider').then(() => show())
    cy.get('dialog').should('exist')
    cy.contains(props.title)
    cy.contains('p', content)
    cy.get('@templateProvider').then(() => {
      props.title = 'Title Changed!'
    })
    cy.get('@templateProvider').then(() => {
      cy.contains('Title Changed!')
    })

    cy.contains('button', 'Confirm').click()
    cy.get('@templateProvider').then(() => {
      cy.get('dialog').should('not.exist')
    })
    cy.get('@onConfirm').should('have.callCount', 1)

    /** Cancel */
    cy.get('@templateProvider').then(() => show())
    cy.get('dialog').should('exist')
    cy.contains('button', 'Cancel').click()
    cy.get('@templateProvider').then(() => {
      cy.get('dialog').should('not.exist')
    })
    cy.get('@onCancel').should('have.callCount', 1)
  })

  it('DialogConfirm - given ref template', () => {
    const { TemplateProvider, useTemplate } = createTemplateProvider()

    cy.mount(TemplateProvider).as('templateProvider')

    const template = ref({
      component: markRaw(defineAsyncComponent(() => import('./DialogConfirm.vue'))),
      props: { title: 'Hello World!' },
    }) satisfies Ref<Template<typeof DialogConfirm>>

    const { show } = useTemplate(template)

    /** Confirm */
    cy.get('@templateProvider').then(() => show())
    cy.get('dialog').should('exist')
    cy.contains(template.value.props.title)
    cy.get('@templateProvider').then(() => {
      template.value.props.title = 'Title Changed!'
    })
    cy.get('@templateProvider').then(() => {
      cy.contains('Title Changed!')
    })
  })

  it('DialogConfirm - given reactive template', () => {
    const { TemplateProvider, useTemplate } = createTemplateProvider()

    cy.mount(TemplateProvider).as('templateProvider')

    const template = reactive({
      component: markRaw(defineAsyncComponent(() => import('./DialogConfirm.vue'))),
      props: { title: 'Hello World!' },
    }) satisfies Template<typeof DialogConfirm>

    const { show } = useTemplate(template)

    /** Confirm */
    cy.get('@templateProvider').then(() => show())
    cy.get('dialog').should('exist')
    cy.contains(template.props.title)
    cy.get('@templateProvider').then(() => {
      template.props.title = 'Title Changed!'
    })
    cy.get('@templateProvider').then(() => {
      cy.contains('Title Changed!')
    })
  })

  it('DialogConfirm - given plain object template', () => {
    const { TemplateProvider, useTemplate } = createTemplateProvider()

    cy.mount(TemplateProvider).as('templateProvider')

    const template = {
      component: defineAsyncComponent(() => import('./DialogConfirm.vue')),
      props: { title: 'Hello World!' },
    } satisfies Template<typeof DialogConfirm>

    const { show } = useTemplate(template)

    /** Confirm */
    cy.get('@templateProvider').then(() => show())
    cy.get('dialog').should('exist')
    cy.contains(template.props.title)
    cy.get('@templateProvider').then(() => {
      template.props.title = 'Title Changed!'
    })
    cy.get('@templateProvider').then(() => {
      cy.contains('Title Changed!').should('not.exist')
    })
  })

  it('DialogConfirmPreview', () => {
    const { TemplateProvider, useTemplate } = createTemplateProvider()

    const DialogConfirmPreview = defineComponent({
      setup() {
        const { show, hide } = useTemplate({
          component: defineAsyncComponent(() => import('./DialogConfirm.vue')),
          attrs: {
            title: 'Hello World!',
            onConfirm: () => hide(),
            onCancel: () => hide(),
          },
          slots: {
            default: defineTemplate({
              component: () => h('p', 'This is a dialog content.'),
            }),
          },
        })
        show()
        return () => h('button', { onClick: () => show() }, 'Open Modal')
      },
    })

    cy.mount(TemplateProvider, {
      slots: { default: () => h(DialogConfirmPreview) },
    }).as('templateProvider')

    cy.get('dialog').should('exist')
    cy.contains('button', 'Cancel').click()
    cy.get('@templateProvider').then(() => {
      cy.get('dialog').should('not.exist')
    })
    cy.contains('button', 'Open Modal').click()
    cy.get('@templateProvider').then(() => {
      cy.get('dialog').should('exist')
    })
    cy.contains('button', 'Cancel').click()
    cy.get('@templateProvider').then(() => {
      cy.get('dialog').should('not.exist')
    })
    cy.contains('button', 'Open Modal').click()
    cy.get('@templateProvider').then(() => {
      cy.get('dialog').should('exist')
    })
  })
})
