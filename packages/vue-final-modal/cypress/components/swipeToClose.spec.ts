import { h, ref } from 'vue'
import VueFinalModal from '~/components/VueFinalModal.vue'
import { createVfm } from '~/index'

function mountSwipeable(swipeToClose: 'down' | 'none') {
  const vfm = createVfm()
  const show = ref(true)
  cy.mount({
    setup: () => () => h(VueFinalModal, {
      'modelValue': show.value,
      'onUpdate:modelValue': (value: boolean) => (show.value = value),
      swipeToClose,
      'contentStyle': { width: '200px', height: '200px', background: 'white' },
      'teleportTo': false,
      'focusTrap': false,
    }, () => 'Swipe me'),
  }, { global: { plugins: [vfm], stubs: { transition: false } } })
  return show
}

/** `eventConstructor` matters: a plain Event is not a MouseEvent, so vfm would read it as a touch event. */
function swipeDown(selector: string) {
  const mouse = { eventConstructor: 'MouseEvent', button: 0, force: true }
  cy.get(selector)
    .trigger('mousedown', { ...mouse, clientX: 100, clientY: 40 })
    .trigger('mousemove', { ...mouse, clientX: 100, clientY: 80 })
    .trigger('mousemove', { ...mouse, clientX: 100, clientY: 160 })
    .trigger('mouseup', { ...mouse, clientX: 100, clientY: 160 })
}

describe('Props: swipeToClose', () => {
  it('closes the modal after swiping in the configured direction', () => {
    const show = mountSwipeable('down')

    cy.contains('Swipe me').should('be.visible')
    swipeDown('.vfm__content')
    cy.get('.vfm').should('not.exist')
    cy.wrap(null).should(() => expect(show.value).to.equal(false))
  })

  it('ignores swipes when set to "none"', () => {
    const show = mountSwipeable('none')

    swipeDown('.vfm__content')
    cy.contains('Swipe me').should('be.visible')
    cy.wrap(null).should(() => expect(show.value).to.equal(true))
  })
})
