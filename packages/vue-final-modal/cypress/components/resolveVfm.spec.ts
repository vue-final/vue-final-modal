import App from './App.vue'
import VueFinalModal from '~/components/VueFinalModal.vue'
import { createVfm, useModal } from '~/index'

describe('Resolve the vfm instance', () => {
  it('keeps the vfm of the app a modal was created in by app.runWithContext() over the active one', () => {
    const appVfm = createVfm()

    cy.mount(App, { global: { plugins: [appVfm], stubs: { transition: false } } }).then(({ wrapper }) => {
      const app = wrapper.vm.$.appContext.app
      const modal = app.runWithContext(() => useModal({
        component: VueFinalModal,
        slots: { default: 'Hello from the mounted app' },
      }))
      createVfm()
      modal.open()
    })

    cy.contains('Hello from the mounted app').should('exist')
  })
})
