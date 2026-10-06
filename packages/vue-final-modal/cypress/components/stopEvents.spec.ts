import { h, ref } from 'vue'
import VueFinalModal from '~/components/VueFinalModal.vue'
import { createVfm } from '~/index'

function mountControlled() {
  const vfm = createVfm()
  const show = ref(false)
  const stopNext = ref(false)
  const stopIfAsked = ({ stop }: { stop: () => void }) => {
    if (stopNext.value)
      stop()
  }
  cy.mount({
    setup: () => () => h(VueFinalModal, {
      'modelValue': show.value,
      'onUpdate:modelValue': (value: boolean) => (show.value = value),
      'onBeforeOpen': stopIfAsked,
      'onBeforeClose': stopIfAsked,
      'teleportTo': false,
      'focusTrap': false,
    }, () => 'Stoppable'),
  }, { global: { plugins: [vfm], stubs: { transition: false } } })
  return { show, stopNext }
}

describe('Events: beforeOpen and beforeClose stop()', () => {
  it('keeps the modal closed and bounces v-model back when beforeOpen stops', () => {
    const { show, stopNext } = mountControlled()

    cy.then(() => {
      stopNext.value = true
      show.value = true
    })
    cy.wrap(null).should(() => expect(show.value).to.equal(false))
    cy.contains('Stoppable').should('not.exist')
  })

  it('keeps the modal open and bounces v-model back when beforeClose stops', () => {
    const { show, stopNext } = mountControlled()

    cy.then(() => {
      show.value = true
    })
    cy.contains('Stoppable').should('be.visible')
    cy.then(() => {
      stopNext.value = true
      show.value = false
    })
    cy.wrap(null).should(() => expect(show.value).to.equal(true))
    cy.contains('Stoppable').should('be.visible')
    cy.then(() => {
      stopNext.value = false
      show.value = false
    })
    cy.contains('Stoppable').should('not.exist')
  })
})
