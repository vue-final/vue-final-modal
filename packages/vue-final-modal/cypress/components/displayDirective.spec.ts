import { h, ref } from 'vue'
import Form from './Form.vue'
import VueFinalModal from '~/components/VueFinalModal.vue'
import { createVfm } from '~/index'

function mountControlled(displayDirective: 'if' | 'show' | 'visible') {
  const vfm = createVfm()
  const show = ref(false)
  cy.mount({
    setup: () => () => h(VueFinalModal, {
      'modelValue': show.value,
      'onUpdate:modelValue': (value: boolean) => (show.value = value),
      displayDirective,
      'teleportTo': false,
      'focusTrap': false,
    }, () => h(Form)),
  }, { global: { plugins: [vfm], stubs: { transition: false } } })
  const setShow = (value: boolean) => cy.then(() => {
    show.value = value
  })
  return setShow
}

describe('Props: displayDirective', () => {
  it('"if" unmounts the modal when closed and resets its content', () => {
    const setShow = mountControlled('if')

    cy.get('.vfm').should('not.exist')
    setShow(true)
    cy.get('.vfm__content').should('be.visible')
    cy.get('.form-account').type('hunter')
    setShow(false)
    cy.get('.vfm').should('not.exist')
    setShow(true)
    cy.get('.form-account').should('be.visible').should('have.value', '')
  })

  it('"show" hides the modal with display none and keeps its content', () => {
    const setShow = mountControlled('show')

    setShow(true)
    cy.get('.form-account').should('be.visible').type('hunter')
    setShow(false)
    cy.get('.vfm').should('exist').should('have.css', 'display', 'none')
    setShow(true)
    cy.get('.form-account').should('be.visible').should('have.value', 'hunter')
  })

  it('"visible" hides the modal with visibility hidden and keeps its content', () => {
    const setShow = mountControlled('visible')

    setShow(true)
    cy.get('.form-account').should('be.visible').type('hunter')
    setShow(false)
    cy.get('.vfm').should('exist').should('have.css', 'visibility', 'hidden')
    setShow(true)
    cy.get('.form-account').should('be.visible').should('have.value', 'hunter')
  })
})
