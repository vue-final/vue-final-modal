import { h, nextTick } from 'vue'
import { createVfm, ModalsContainer, useModal, VueFinalModal } from '~/index'
import App from './App.vue'
import Form from './Form.vue'
import ModalConfirm from './ModalConfirm.vue'
import NestedDeclarative from './NestedDeclarative.vue'

function mountNestedConfirmModals(options: { keepAlive?: boolean } = {}) {
  const vfm = createVfm()
  const second = useModal({
    ...options,
    component: ModalConfirm,
    attrs: { title: 'second', contentClass: 'second-modal', onConfirm: () => second.close() },
  })
  const first = useModal({
    ...options,
    component: ModalConfirm,
    attrs: { title: 'first', contentClass: 'first-modal', onConfirm: () => second.open() },
  })

  cy.mount(App, { global: { plugins: [vfm], stubs: { transition: false } } }).as('app')
  cy.get('@app').then(() => first.open())
}

function expectFocusBackInFirstModal(options: { keepAlive?: boolean } = {}) {
  cy.get('.second-modal').should(options.keepAlive ? 'not.be.visible' : 'not.exist')
  cy.focused().should('have.class', 'confirm')
  cy.focused().closest('.first-modal').should('exist')

  /** The first modal must trap focus again: Tab cycles Confirm and Cancel. */
  cy.realPress('Tab')
  cy.focused().should('have.class', 'cancel')
  cy.realPress('Tab')
  cy.focused().should('have.class', 'confirm')
}

describe('focus trap with nested modals', () => {
  it('gives focus back to the first modal after the second one is closed with a real click', () => {
    mountNestedConfirmModals()

    cy.get('.first-modal .confirm').realClick()
    cy.focused().should('have.class', 'second-modal')
    cy.get('.second-modal .confirm').realClick()

    expectFocusBackInFirstModal()
  })

  it('gives focus back to the first modal after the second one is closed with Escape', () => {
    mountNestedConfirmModals()

    cy.get('.first-modal .confirm').realClick()
    cy.focused().should('have.class', 'second-modal')
    cy.realPress('Escape')

    expectFocusBackInFirstModal()
  })

  it('gives focus back to the first modal after the second one is closed by clicking outside its content', () => {
    mountNestedConfirmModals()

    cy.get('.first-modal .confirm').realClick()
    cy.focused().should('have.class', 'second-modal')
    cy.get('.vfm').last().realClick({ x: 20, y: 20 })

    expectFocusBackInFirstModal()
  })

  it('gives focus back to the first modal when both modals are driven by the keyboard only', () => {
    mountNestedConfirmModals()

    cy.focused().should('have.class', 'first-modal')
    cy.realPress('Tab')
    cy.focused().should('have.class', 'confirm')
    cy.realPress('Enter')

    cy.focused().should('have.class', 'second-modal')
    cy.realPress('Tab')
    cy.focused().should('have.class', 'confirm')
    cy.realPress('Enter')

    expectFocusBackInFirstModal()
  })

  it('gives focus back to the first modal when both modals are kept alive', () => {
    mountNestedConfirmModals({ keepAlive: true })

    cy.get('.first-modal .confirm').realClick()
    cy.focused().should('have.class', 'second-modal')
    cy.get('.second-modal .confirm').realClick()

    expectFocusBackInFirstModal({ keepAlive: true })
  })

  it('gives focus back level by level with three nested modals', () => {
    const vfm = createVfm()
    const third = useModal({
      component: ModalConfirm,
      attrs: { title: 'third', contentClass: 'third-modal', onConfirm: () => third.close() },
    })
    const second = useModal({
      component: ModalConfirm,
      attrs: { title: 'second', contentClass: 'second-modal', onConfirm: () => third.open() },
    })
    const first = useModal({
      component: ModalConfirm,
      attrs: { title: 'first', contentClass: 'first-modal', onConfirm: () => second.open() },
    })

    cy.mount(App, { global: { plugins: [vfm], stubs: { transition: false } } }).as('app')
    cy.get('@app').then(() => first.open())

    cy.get('.first-modal .confirm').realClick()
    cy.focused().should('have.class', 'second-modal')
    cy.get('.second-modal .confirm').realClick()
    cy.focused().should('have.class', 'third-modal')
    cy.get('.third-modal .confirm').realClick()

    cy.get('.third-modal').should('not.exist')
    cy.focused().should('have.class', 'confirm')
    cy.focused().closest('.second-modal').should('exist')

    cy.get('.second-modal .cancel').realClick()

    expectFocusBackInFirstModal()
  })

  it('gives focus back when nested modals are created on demand and closed from the slot', () => {
    const vfm = createVfm()
    let depth = 0
    function openConfirmModal() {
      depth += 1
      useModal({
        defaultModelValue: true,
        component: ModalConfirm,
        attrs: { title: `level ${depth}`, contentClass: `level-${depth}`, onConfirm: () => openConfirmModal() },
      })
    }

    cy.mount(App, { global: { plugins: [vfm], stubs: { transition: false } } }).as('app')
    cy.get('@app').then(() => openConfirmModal())

    cy.focused().should('have.class', 'level-1')
    cy.get('.level-1 .confirm').realClick()
    cy.focused().should('have.class', 'level-2')
    cy.get('.level-2 .cancel').realClick()

    cy.get('.level-2').should('not.exist')
    cy.focused().should('have.class', 'confirm')
    cy.focused().closest('.level-1').should('exist')
  })

  it('gives focus back when the second modal is declared inside the first one', () => {
    const vfm = createVfm()

    cy.mount(NestedDeclarative, { global: { plugins: [vfm], stubs: { transition: false } } })

    cy.get('.open-first').realClick()
    cy.focused().should('have.class', 'first-modal')
    cy.get('.open-second').realClick()
    cy.focused().should('have.class', 'second-modal')
    cy.get('.close-second').realClick()

    cy.get('.second-modal').should('not.exist')
    cy.focused().should('have.class', 'open-second')
  })

  describe('a second modal closed before its focus trap could activate', () => {
    function mountAndFocusOpenSecond() {
      const vfm = createVfm()
      cy.mount(NestedDeclarative, { global: { plugins: [vfm], stubs: { transition: false } } })
      cy.get('.open-first').realClick()
      cy.focused().should('have.class', 'first-modal')
      cy.get('.open-second').focus()
      cy.focused().should('have.class', 'open-second')
      return vfm
    }

    function expectFirstModalStillTrapsFocus() {
      cy.get('.second-modal').should('not.exist')
      cy.focused().should('have.class', 'open-second')
      /** The only element the first modal can Tab to. */
      cy.realPress('Tab')
      cy.focused().should('have.class', 'open-second')
    }

    it('leaves focus in the first modal when the second one is closed in the tick it opened', () => {
      const vfm = mountAndFocusOpenSecond()

      cy.wrap(null, { log: false }).then(async () => {
        vfm.open('second')
        await nextTick()
        vfm.close('second')
      })

      expectFirstModalStillTrapsFocus()
    })

    it('leaves focus in the first modal when the second one is closed in the frame it opened', () => {
      const vfm = mountAndFocusOpenSecond()

      cy.wrap(null, { log: false }).then(async () => {
        vfm.open('second')
        await nextTick()
        await nextTick()
        vfm.close('second')
      })

      expectFirstModalStillTrapsFocus()
    })
  })

  it('keeps focus inside the top modal and gives it back when that modal closes', () => {
    const vfm = createVfm()
    const first = useModal({
      component: VueFinalModal,
      attrs: { contentClass: 'first-modal-content' },
      slots: { default: Form },
    })
    const second = useModal({
      component: VueFinalModal,
      attrs: { contentClass: 'second-modal-content' },
      slots: { default: '<button class="second-ok">OK</button>' },
    })

    cy.mount(App, { global: { plugins: [vfm], stubs: { transition: false } } }).as('app')

    cy.get('@app').then(() => first.open())
    cy.get('.form-submit').focus()
    cy.focused().should('have.class', 'form-submit')

    cy.get('@app').then(() => second.open())
    cy.focused().should('have.class', 'second-modal-content')

    /** Focus pulled into the covered modal must bounce back into the top one. */
    cy.get('.form-submit').focus()
    cy.focused().should('have.class', 'second-modal-content')
    cy.get('.second-ok').focus()
    cy.focused().should('have.class', 'second-ok')

    cy.get('@app').then(() => second.close())
    cy.focused().should('have.class', 'form-submit')
  })

  describe('focus given back along the levels that opened each other', () => {
    function mountFromPage() {
      const c = useModal({ component: ModalConfirm, attrs: { title: 'C', contentClass: 'modal-c' } })
      const b = useModal({ component: ModalConfirm, attrs: { title: 'B', contentClass: 'modal-b', onConfirm: () => c.open() } })
      const a = useModal({ component: ModalConfirm, attrs: { title: 'A', contentClass: 'modal-a', onConfirm: () => b.open() } })
      cy.mount({
        setup: () => () => [h('button', { id: 'page-button', onClick: () => a.open() }, 'Open A'), h(ModalsContainer)],
      }, { global: { plugins: [createVfm()], stubs: { transition: false } } })
      return { a, b, c }
    }

    it('gives focus back to the page when the levels close after the first one closed first', () => {
      const { a, b, c } = mountFromPage()
      cy.get('#page-button').realClick()
      cy.focused().should('have.class', 'modal-a')
      cy.get('.modal-a .confirm').realClick()
      cy.focused().should('have.class', 'modal-b')
      cy.get('.modal-b .confirm').realClick()
      cy.focused().should('have.class', 'modal-c')

      cy.then(() => a.close())
      cy.get('.modal-a').should('not.exist')
      cy.focused().should('have.class', 'modal-c')
      cy.then(() => c.close())
      cy.get('.modal-c').should('not.exist')
      cy.focused().should('have.class', 'confirm').closest('.modal-b').should('exist')
      cy.then(() => b.close())
      cy.get('.modal-b').should('not.exist')
      cy.focused().should('have.id', 'page-button')
    })

    it('gives focus back to the button that opened each level when the next one opened before the focus moved in', () => {
      mountFromPage()
      cy.get('#page-button').realClick()
      cy.get('.modal-a .confirm').realClick()
      cy.get('.modal-b .confirm').realClick()
      cy.focused().should('have.class', 'modal-c')

      cy.get('.modal-c .cancel').realClick()
      cy.get('.modal-c').should('not.exist')
      cy.focused().should('have.class', 'confirm').closest('.modal-b').should('exist')
      cy.get('.modal-b .cancel').realClick()
      cy.get('.modal-b').should('not.exist')
      cy.focused().should('have.class', 'confirm').closest('.modal-a').should('exist')
      cy.get('.modal-a .cancel').realClick()
      cy.get('.modal-a').should('not.exist')
      cy.focused().should('have.id', 'page-button')
    })
  })
})
