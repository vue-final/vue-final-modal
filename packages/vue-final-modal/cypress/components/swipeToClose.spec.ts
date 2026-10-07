import { h, ref } from 'vue'
import type { ComponentProps } from '~/types'
import VueFinalModal from '~/components/VueFinalModal.vue'
import { createVfm } from '~/index'

type Direction = 'up' | 'down' | 'left' | 'right'
type ModalProps = Partial<ComponentProps<typeof VueFinalModal>>

function mountSwipeable(props: ModalProps, slot: () => unknown = () => 'Swipe me') {
  const vfm = createVfm()
  const show = ref(true)
  cy.mount({
    setup: () => () => h(VueFinalModal, {
      'modelValue': show.value,
      'onUpdate:modelValue': (value: boolean) => (show.value = value),
      'contentStyle': { width: '200px', height: '200px', background: 'white', position: 'relative' },
      'teleportTo': false,
      'focusTrap': false,
      ...props,
    }, slot),
  }, { global: { plugins: [vfm], stubs: { transition: false } } })
  return show
}

/** `eventConstructor` matters: a plain Event is not a MouseEvent, so vfm would read it as a touch event. */
const mouse = { eventConstructor: 'MouseEvent', button: 0, force: true }

/** translateY(0px) resolves to the identity matrix, not to `none`. */
const NO_OFFSET = 'matrix(1, 0, 0, 1, 0, 0)'

const vector: Record<Direction, [number, number]> = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }

/** Drags from the center of the element by `distance` px, in steps, then releases; `pause` ms before the release makes the swipe slow. */
function swipe(selector: string, direction: Direction, distance: number, { pause = 0 } = {}) {
  const [dx, dy] = vector[direction]
  const start = { clientX: 100, clientY: 100 }
  const at = (fraction: number) => ({ clientX: start.clientX + dx * distance * fraction, clientY: start.clientY + dy * distance * fraction })
  const chain = cy.get(selector)
    .trigger('mousedown', { ...mouse, ...start })
    .trigger('mousemove', { ...mouse, ...at(0.5) })
    .trigger('mousemove', { ...mouse, ...at(1) })
  if (pause)
    cy.wait(pause)
  chain.trigger('mouseup', { ...mouse, ...at(1) })
}

function expectClosed(show: { value: boolean }) {
  cy.get('.vfm').should('not.exist')
  cy.wrap(null).should(() => expect(show.value).to.equal(false))
}

function expectStillOpen(show: { value: boolean }) {
  cy.get('.vfm__content').should('be.visible')
  cy.wrap(null).should(() => expect(show.value).to.equal(true))
}

describe('Props: swipeToClose', () => {
  (['up', 'down', 'left', 'right'] as Direction[]).forEach((direction) => {
    it(`closes after a swipe ${direction} when set to "${direction}"`, () => {
      const show = mountSwipeable({ swipeToClose: direction })

      swipe('.vfm__content', direction, 120)

      expectClosed(show)
    })
  })

  it('ignores swipes when set to "none"', () => {
    const show = mountSwipeable({ swipeToClose: 'none' })

    swipe('.vfm__content', 'down', 120)

    expectStillOpen(show)
  })

  it('ignores a swipe in another direction', () => {
    const show = mountSwipeable({ swipeToClose: 'down' })

    swipe('.vfm__content', 'up', 120)
    swipe('.vfm__content', 'left', 120)

    expectStillOpen(show)
  })

  it('closes after a short but quick swipe', () => {
    const show = mountSwipeable({ swipeToClose: 'down' })

    swipe('.vfm__content', 'down', 10)

    expectClosed(show)
  })

  it('keeps a slow swipe that stays under a tenth of the content size', () => {
    const show = mountSwipeable({ swipeToClose: 'down' })

    swipe('.vfm__content', 'down', 15, { pause: 400 })

    expectStillOpen(show)
    cy.get('.vfm__content').should('have.css', 'transform', NO_OFFSET)
  })

  it('closes after a slow swipe that goes beyond a tenth of the content size', () => {
    const show = mountSwipeable({ swipeToClose: 'down' })

    swipe('.vfm__content', 'down', 60, { pause: 400 })

    expectClosed(show)
  })

  it('moves the content with the pointer and springs it back when released', () => {
    const show = mountSwipeable({ swipeToClose: 'down' })

    cy.get('.vfm__content').should('have.class', 'vfm-bounce-back')
    cy.get('.vfm__content')
      .trigger('mousedown', { ...mouse, clientX: 100, clientY: 100 })
      .trigger('mousemove', { ...mouse, clientX: 100, clientY: 115 })
    cy.get('.vfm__content').should('not.have.class', 'vfm-bounce-back')
    cy.get('.vfm__content').should('have.css', 'transform', 'matrix(1, 0, 0, 1, 0, 15)')

    /** Slow and under a tenth of the content height, so the release must spring back instead of closing. */
    cy.wait(400)
    cy.get('.vfm__content').trigger('mouseup', { ...mouse, clientX: 100, clientY: 115 })
    cy.get('.vfm__content').should('have.class', 'vfm-bounce-back')
    cy.get('.vfm__content').should('have.css', 'transform', NO_OFFSET)
    expectStillOpen(show)
  })

  it('does not move the content before the threshold is passed', () => {
    const show = mountSwipeable({ swipeToClose: 'down', threshold: 50 })

    cy.get('.vfm__content')
      .trigger('mousedown', { ...mouse, clientX: 100, clientY: 100 })
      .trigger('mousemove', { ...mouse, clientX: 100, clientY: 130 })
    cy.get('.vfm__content').should('have.css', 'transform', NO_OFFSET)
    cy.get('.vfm__content').trigger('mouseup', { ...mouse, clientX: 100, clientY: 130 })

    expectStillOpen(show)
  })

  it('subtracts the threshold from the offset once passed', () => {
    mountSwipeable({ swipeToClose: 'down', threshold: 50 })

    cy.get('.vfm__content')
      .trigger('mousedown', { ...mouse, clientX: 100, clientY: 100 })
      .trigger('mousemove', { ...mouse, clientX: 100, clientY: 180 })
    cy.get('.vfm__content').should('have.css', 'transform', 'matrix(1, 0, 0, 1, 0, 30)')
  })

  it('keeps the modal when the swipe turns back before release', () => {
    const show = mountSwipeable({ swipeToClose: 'down' })

    cy.get('.vfm__content')
      .trigger('mousedown', { ...mouse, clientX: 100, clientY: 100 })
      .trigger('mousemove', { ...mouse, clientX: 100, clientY: 180 })
    cy.wait(50)
    cy.get('.vfm__content').trigger('mousemove', { ...mouse, clientX: 100, clientY: 150 })
    cy.wait(50)
    cy.get('.vfm__content').trigger('mouseup', { ...mouse, clientX: 100, clientY: 150 })

    expectStillOpen(show)
    cy.get('.vfm__content').should('have.css', 'transform', NO_OFFSET)
  })

  it('ignores a swipe that starts on a text field', () => {
    const show = mountSwipeable({ swipeToClose: 'down' }, () => [
      h('input', { class: 'field', style: 'width: 100px' }),
      h('textarea', { class: 'area' }),
    ])

    swipe('.field', 'down', 120)
    swipe('.area', 'down', 120)

    expectStillOpen(show)
  })

  it('ignores a swipe that starts inside a child that can still scroll that way', () => {
    const show = mountSwipeable({ swipeToClose: 'down' }, () => h('div', {
      class: 'list',
      style: 'height: 100px; overflow-y: auto',
    }, h('div', { style: 'height: 400px' })))

    cy.get('.list').scrollTo(0, 50)
    swipe('.list', 'down', 120)
    expectStillOpen(show)

    cy.get('.list').scrollTo(0, 0)
    swipe('.list', 'down', 120)
    expectClosed(show)
  })

  describe('with showSwipeBanner', () => {
    it('swipes only from the banner', () => {
      const show = mountSwipeable({ swipeToClose: 'right', showSwipeBanner: true })

      swipe('.vfm__content', 'right', 120)
      expectStillOpen(show)

      swipe('.vfm-swipe-banner-container', 'right', 120)
      expectClosed(show)
    })

    it('renders the swipe-banner slot inside the banner', () => {
      mountSwipeable({ swipeToClose: 'right', showSwipeBanner: true }, () => 'Swipe me')
      cy.get('.vfm-swipe-banner-container .vfm-swipe-banner-back').should('exist')
      cy.get('.vfm-swipe-banner-container .vfm-swipe-banner-forward').should('exist')
    })
  })

  describe('with preventNavigationGestures', () => {
    it('renders the edge bars without a banner and cancels touches on them', () => {
      mountSwipeable({ swipeToClose: 'none', preventNavigationGestures: true })

      cy.get('.vfm-swipe-banner-back').should('exist')
      cy.get('.vfm-swipe-banner-container').then(([container]) => {
        const event = new TouchEvent('touchstart', { bubbles: true, cancelable: true })
        container.dispatchEvent(event)
        expect(event.defaultPrevented).to.equal(true)
      })
    })

    it('renders no bars when neither option is set', () => {
      mountSwipeable({ swipeToClose: 'none' })

      cy.get('.vfm__content').should('exist')
      cy.get('.vfm-swipe-banner-container').should('not.exist')
    })
  })
})
