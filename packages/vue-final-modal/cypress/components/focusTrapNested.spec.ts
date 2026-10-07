import { nextTick } from 'vue'
import App from './App.vue'
import Form from './Form.vue'
import ModalConfirm from './ModalConfirm.vue'
import NestedDeclarative from './NestedDeclarative.vue'
import { VueFinalModal, createVfm, useModal } from '~/index'

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

  /** The first modal must trap focus again: Tab cycles content, Confirm and Cancel. */
  cy.realPress('Tab')
  cy.focused().should('have.class', 'cancel')
  cy.realPress('Tab')
  cy.focused().should('have.class', 'first-modal')
  cy.realPress('Tab')
  cy.focused().should('have.class', 'confirm')
}

describe('Focus trap with nested modals', () => {
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
      cy.realPress('Tab')
      cy.focused().should('have.class', 'first-modal')
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
})
