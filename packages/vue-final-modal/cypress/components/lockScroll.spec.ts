import { h, ref } from 'vue'
import type { ComponentProps } from '~/types'
import VueFinalModal from '~/components/VueFinalModal.vue'
import { createVfm } from '~/index'

type ModalProps = Partial<ComponentProps<typeof VueFinalModal>>

function Modal(show: { value: boolean }, props: ModalProps = {}) {
  return h(VueFinalModal, {
    'modelValue': show.value,
    'onUpdate:modelValue': (value: boolean) => (show.value = value),
    'teleportTo': false,
    'focusTrap': false,
    ...props,
  }, () => 'content')
}

function mountModal(props: ModalProps = {}) {
  const vfm = createVfm()
  const show = ref(true)
  cy.mount({ setup: () => () => Modal(show, props) }, { global: { plugins: [vfm], stubs: { transition: false } } })
  return show
}

function bodyStyle(property: 'overflow' | 'paddingRight') {
  return cy.document().its(`body.style.${property}`)
}

afterEach(() => {
  cy.document().then(doc => doc.body.removeAttribute('style'))
})

describe('Props: lockScroll', () => {
  it('hides the body overflow while open and restores it after close', () => {
    const show = mountModal()

    bodyStyle('overflow').should('equal', 'hidden')

    cy.then(() => show.value = false)
    bodyStyle('overflow').should('equal', '')
  })

  it('restores the overflow the body had before', () => {
    cy.document().then(doc => doc.body.style.overflow = 'auto')
    const show = mountModal()

    bodyStyle('overflow').should('equal', 'hidden')

    cy.then(() => show.value = false)
    bodyStyle('overflow').should('equal', 'auto')
  })

  it('leaves the body alone with lockScroll false', () => {
    mountModal({ lockScroll: false })

    cy.get('.vfm__content').should('exist')
    bodyStyle('overflow').should('equal', '')
  })

  it('follows the prop while the modal is open', () => {
    const vfm = createVfm()
    const lockScroll = ref(true)
    cy.mount({ setup: () => () => Modal({ value: true }, { lockScroll: lockScroll.value }) }, { global: { plugins: [vfm], stubs: { transition: false } } })

    bodyStyle('overflow').should('equal', 'hidden')
    cy.then(() => lockScroll.value = false)
    bodyStyle('overflow').should('equal', '')
    cy.then(() => lockScroll.value = true)
    bodyStyle('overflow').should('equal', 'hidden')
  })

  it('stays locked while a nested modal closes and unlocks with the last one', () => {
    const vfm = createVfm()
    const first = ref(true)
    const second = ref(true)
    cy.mount({
      setup: () => () => [
        Modal(first, { contentClass: 'first' }),
        Modal(second, { contentClass: 'second' }),
      ],
    }, { global: { plugins: [vfm], stubs: { transition: false } } })

    cy.get('.second').should('exist')
    bodyStyle('overflow').should('equal', 'hidden')

    cy.then(() => second.value = false)
    cy.get('.second').should('not.exist')
    bodyStyle('overflow').should('equal', 'hidden')

    cy.then(() => first.value = false)
    bodyStyle('overflow').should('equal', '')
  })

  it('unlocks when an open modal is unmounted', () => {
    const vfm = createVfm()
    const mounted = ref(true)
    cy.mount({ setup: () => () => mounted.value ? Modal({ value: true }) : null }, { global: { plugins: [vfm], stubs: { transition: false } } })

    bodyStyle('overflow').should('equal', 'hidden')

    cy.then(() => mounted.value = false)
    cy.get('.vfm').should('not.exist')
    bodyStyle('overflow').should('equal', '')
  })

  it('also locks the scroll container a modal is rendered in, and gives it back on close', () => {
    cy.document().then((doc) => {
      const style = doc.createElement('style')
      style.id = 'scroller-style'
      style.textContent = '.scroller { height: 200px; overflow-y: auto } .scroller-content { height: 1000px }'
      doc.head.appendChild(style)
    })
    const vfm = createVfm()
    const show = ref(true)
    cy.mount({
      setup: () => () => h('div', { class: 'scroller' }, [h('div', { class: 'scroller-content' }), Modal(show)]),
    }, { global: { plugins: [vfm], stubs: { transition: false } } })

    cy.get('.scroller').should('have.css', 'overflow-y', 'hidden')
    cy.then(() => show.value = false)
    cy.get('.vfm').should('not.exist')
    cy.get('.scroller').should('have.css', 'overflow-y', 'auto')
    cy.document().then(doc => doc.getElementById('scroller-style')?.remove())
  })

  it('locks on every open of a modal kept in the DOM', () => {
    const show = mountModal({ displayDirective: 'show' })

    bodyStyle('overflow').should('equal', 'hidden')
    cy.then(() => show.value = false)
    bodyStyle('overflow').should('equal', '')
    cy.then(() => show.value = true)
    bodyStyle('overflow').should('equal', 'hidden')
  })

  describe('with a classic scrollbar', () => {
    beforeEach(() => {
      cy.document().then((doc) => {
        const style = doc.createElement('style')
        style.id = 'classic-scrollbar'
        style.textContent = '::-webkit-scrollbar { width: 15px } body { min-height: 300vh }'
        doc.head.appendChild(style)
      })
    })

    afterEach(() => {
      cy.document().then(doc => doc.getElementById('classic-scrollbar')?.remove())
    })

    it('reserves the scrollbar gap as body padding while locked', () => {
      const show = mountModal()

      bodyStyle('paddingRight').should('equal', '15px')

      cy.then(() => show.value = false)
      bodyStyle('paddingRight').should('equal', '')
    })

    it('adds the gap to the padding the body already had', () => {
      cy.document().then(doc => doc.body.style.paddingRight = '10px')
      const show = mountModal()

      bodyStyle('paddingRight').should('equal', '25px')

      cy.then(() => show.value = false)
      bodyStyle('paddingRight').should('equal', '10px')
    })

    it('leaves the padding alone with reserveScrollBarGap false', () => {
      mountModal({ reserveScrollBarGap: false })

      bodyStyle('overflow').should('equal', 'hidden')
      bodyStyle('paddingRight').should('equal', '')
    })

    it('reserves the scrollbar gap of the scroll container a modal is rendered in, so its content does not shift', () => {
      cy.document().then((doc) => {
        const style = doc.createElement('style')
        style.id = 'gap-scroller-style'
        style.textContent = '.scroller { height: 200px; overflow-y: auto } .scroller-content { height: 1000px }'
        doc.head.appendChild(style)
      })
      const vfm = createVfm()
      const show = ref(false)
      cy.mount({
        setup: () => () => h('div', { class: 'scroller' }, [h('div', { class: 'scroller-content' }), Modal(show)]),
      }, { global: { plugins: [vfm], stubs: { transition: false } } })

      cy.get('.scroller-content').invoke('outerWidth').then((widthWithScrollbar) => {
        cy.then(() => show.value = true)
        cy.get('.scroller').should('have.css', 'overflow-y', 'hidden')
        cy.get('.scroller').should($scroller => expect($scroller[0].style.paddingRight).to.equal('15px'))
        cy.get('.scroller-content').invoke('outerWidth').should('equal', widthWithScrollbar)
      })

      cy.then(() => show.value = false)
      cy.get('.vfm').should('not.exist')
      cy.get('.scroller').should($scroller => expect($scroller[0].style.paddingRight).to.equal(''))
      cy.document().then(doc => doc.getElementById('gap-scroller-style')?.remove())
    })
  })
})
