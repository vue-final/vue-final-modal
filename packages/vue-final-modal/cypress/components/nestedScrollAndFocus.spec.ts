import { lockStateMap } from '@hunterliu/scroll-lock'
import { h } from 'vue'
import { createVfm, ModalsContainer, useModal } from '~/index'
import ModalConfirm from './ModalConfirm.vue'

function lockCount(el: Element | null) {
  return el ? lockStateMap.get(el as HTMLElement)?.count ?? 0 : 0
}

function focusLabel(el: Element | null) {
  const modal = el?.closest('[class*="modal-"]')?.className.match(/modal-[a-z]/)?.[0]
  if (el?.id)
    return `#${el.id}`
  if (el?.classList.contains('vfm__content'))
    return `${modal} content`
  if (el?.tagName === 'BUTTON')
    return `${modal} ${el.className}`
  return el?.tagName.toLowerCase() ?? 'none'
}

/** body: lock count, overflow-y, padding-right; scroller: lock count, overflow-y, scrollbar-gutter; then the focused element. */
function state(doc: Document) {
  const { body } = doc
  const scroller = doc.getElementById('scroller')!
  return [
    `body ${lockCount(body)} ${body.style.overflowY || '-'} ${body.style.paddingRight || '-'}`,
    `scroller ${lockCount(scroller)} ${scroller.style.overflowY || '-'} ${scroller.style.scrollbarGutter || '-'}`,
    `focus ${focusLabel(doc.activeElement)}`,
  ].join(' | ')
}

/** The room the scrollbars take before any lock, which differs between platforms: none for overlay scrollbars. */
const scrollbars = { page: '-', scroller: '-' }

function measureScrollbars() {
  cy.document().then((doc) => {
    const page = doc.defaultView!.innerWidth - doc.documentElement.clientWidth
    const scroller = doc.getElementById('scroller')!
    scrollbars.page = page > 0 ? `${page}px` : '-'
    scrollbars.scroller = scroller.offsetWidth > scroller.clientWidth ? 'stable' : '-'
  })
}

/** `GAP` stands for the padding the body gets for its scrollbar, and `GUTTER` for the scroller's scrollbar-gutter. */
function expectState(expected: string) {
  cy.document().should(doc => expect(state(doc)).to.equal(expected.replace('GAP', scrollbars.page).replace('GUTTER', scrollbars.scroller)))
}

function mountThree(b: Record<string, unknown> = {}) {
  const c = useModal({ component: ModalConfirm, attrs: { title: 'C', contentClass: 'modal-c' } })
  const second = useModal({ component: ModalConfirm, attrs: { title: 'B', contentClass: 'modal-b', onConfirm: () => c.open(), ...b } })
  const a = useModal({ component: ModalConfirm, attrs: { title: 'A', contentClass: 'modal-a', onConfirm: () => second.open() } })
  cy.mount({
    setup: () => () => [
      h('button', { id: 'page-button', onClick: () => a.open() }, 'Open A'),
      h('div', { id: 'scroller', style: 'height: 200px; overflow: auto' }, [h('div', { style: 'height: 1000px' }, 'scroller')]),
      ...Array.from({ length: 200 }, (_, i) => h('p', `row ${i}`)),
      h(ModalsContainer),
    ],
  }, { global: { plugins: [createVfm()], stubs: { transition: false } } })
  measureScrollbars()
  return { a, b: second, c }
}

/** A opens from the page button, B from A's Confirm and C from B's Confirm, each once the level below has the focus, as a user would. */
function openThree() {
  cy.get('#page-button').realClick()
  cy.focused().should('have.class', 'modal-a')
  cy.get('.modal-a .confirm').realClick()
  cy.focused().should('have.class', 'modal-b')
  cy.get('.modal-b .confirm').realClick()
  cy.focused().should('have.class', 'modal-c')
}

function closeWithCancel(level: 'a' | 'b' | 'c') {
  cy.get(`.modal-${level} .cancel`).realClick()
  cy.get(`.modal-${level}`).should('not.exist')
}

describe('nested modals: scroll lock and focus', () => {
  afterEach(() => {
    cy.document().then(doc => doc.getElementById('classic-scrollbars')?.remove())
  })

  it('locks the body once per level, restores it when the last level closes, and gives focus back level by level', () => {
    mountThree()
    expectState('body 0 - - | scroller 0 auto - | focus body')

    cy.get('#page-button').realClick()
    cy.get('.modal-a').should('exist')
    expectState('body 1 hidden GAP | scroller 0 auto - | focus modal-a content')
    cy.get('.modal-a .confirm').realClick()
    expectState('body 2 hidden GAP | scroller 0 auto - | focus modal-b content')
    cy.get('.modal-b .confirm').realClick()
    expectState('body 3 hidden GAP | scroller 0 auto - | focus modal-c content')

    closeWithCancel('c')
    expectState('body 2 hidden GAP | scroller 0 auto - | focus modal-b confirm')
    /** B traps the focus again. */
    cy.realPress('Tab')
    expectState('body 2 hidden GAP | scroller 0 auto - | focus modal-b cancel')
    closeWithCancel('b')
    expectState('body 1 hidden GAP | scroller 0 auto - | focus modal-a confirm')
    closeWithCancel('a')
    expectState('body 0 - - | scroller 0 auto - | focus #page-button')
  })

  it('takes no body lock for a level with lockScroll false, and never releases the lock of another level', () => {
    mountThree({ lockScroll: false })
    openThree()
    expectState('body 2 hidden GAP | scroller 0 auto - | focus modal-c content')

    closeWithCancel('c')
    expectState('body 1 hidden GAP | scroller 0 auto - | focus modal-b confirm')
    closeWithCancel('b')
    expectState('body 1 hidden GAP | scroller 0 auto - | focus modal-a confirm')
    closeWithCancel('a')
    expectState('body 0 - - | scroller 0 auto - | focus #page-button')
  })

  it('also locks the scroll container a level is rendered in, and releases only its own locks', () => {
    mountThree({ teleportTo: '#scroller' })
    cy.get('#page-button').realClick()
    cy.focused().should('have.class', 'modal-a')
    cy.get('.modal-a .confirm').realClick()
    expectState('body 2 hidden GAP | scroller 1 hidden GUTTER | focus modal-b content')
    cy.get('.modal-b .confirm').realClick()
    expectState('body 3 hidden GAP | scroller 1 hidden GUTTER | focus modal-c content')

    closeWithCancel('c')
    expectState('body 2 hidden GAP | scroller 1 hidden GUTTER | focus modal-b confirm')
    closeWithCancel('b')
    expectState('body 1 hidden GAP | scroller 0 auto - | focus modal-a confirm')
    closeWithCancel('a')
    expectState('body 0 - - | scroller 0 auto - | focus #page-button')
  })

  it('keeps the room of the scrollbars while any level holds the lock, and gives it back with the last one', () => {
    /** Headless Chrome draws overlay scrollbars, which take no room to keep. */
    cy.document().then((doc) => {
      const style = doc.createElement('style')
      style.id = 'classic-scrollbars'
      style.textContent = '::-webkit-scrollbar { width: 12px; height: 12px } ::-webkit-scrollbar-thumb { background: #888 }'
      doc.head.append(style)
    })
    mountThree({ teleportTo: '#scroller' })
    openThree()
    expectState('body 3 hidden 12px | scroller 1 hidden stable | focus modal-c content')

    closeWithCancel('c')
    expectState('body 2 hidden 12px | scroller 1 hidden stable | focus modal-b confirm')
    closeWithCancel('b')
    expectState('body 1 hidden 12px | scroller 0 auto - | focus modal-a confirm')
    closeWithCancel('a')
    expectState('body 0 - - | scroller 0 auto - | focus #page-button')
  })

  it('keeps the top level trapped and locked when a lower level closes first', () => {
    const { a, b, c } = mountThree()
    openThree()

    cy.then(() => a.close())
    cy.get('.modal-a').should('not.exist')
    expectState('body 2 hidden GAP | scroller 0 auto - | focus modal-c content')
    cy.realPress('Tab')
    expectState('body 2 hidden GAP | scroller 0 auto - | focus modal-c confirm')

    cy.then(() => c.close())
    cy.get('.modal-c').should('not.exist')
    expectState('body 1 hidden GAP | scroller 0 auto - | focus modal-b confirm')
    cy.then(() => b.close())
    cy.get('.modal-b').should('not.exist')
    cy.document().should(doc => expect(lockCount(doc.body)).to.equal(0))
  })
})
