import TestUseModal from './TestUseModal.vue'
import { createVfm } from '~/index'

it('renders the VueFinalModal', () => {
  cy.mount(TestUseModal, {
    global: {
      plugins: [createVfm()],
    },
  })
  cy.contains('Hello World!')
})
