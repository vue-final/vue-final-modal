import { h, ref } from 'vue'
import VueFinalModal from '~/components/VueFinalModal.vue'
import { createVfm } from '~/index'
import '../../dist/style.css'

describe('Mounting a modal again on the client', () => {
  it('plays the enter transition again when the same vnode is mounted a second time', () => {
    const vfm = createVfm()
    const show = ref(false)
    const slow = { name: 'vfm-fade', duration: 2000 }
    const modal = h(VueFinalModal, { modelValue: true, teleportTo: false, contentTransition: slow, overlayTransition: slow }, () => 'Reused')
    cy.mount({ setup: () => () => show.value ? modal : null }, { global: { plugins: [vfm], stubs: { transition: false } } })

    cy.then(() => show.value = true)
    cy.get('.vfm__content').should('have.class', 'vfm-fade-enter-active')
    cy.then(() => show.value = false)
    cy.get('.vfm').should('not.exist')
    cy.then(() => show.value = true)
    cy.get('.vfm__content').should('have.class', 'vfm-fade-enter-active')
  })
})
