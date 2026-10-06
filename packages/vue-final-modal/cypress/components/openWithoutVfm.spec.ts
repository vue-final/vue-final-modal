import VueFinalModal from '~/components/VueFinalModal.vue'
import { useModal } from '~/index'

describe('useModal() without a vfm in the browser', () => {
  it('still throws when opened and no vfm is installed', () => {
    const modal = useModal({ component: VueFinalModal, slots: { default: 'Hello World!' } })

    cy.wrap(null).then(() => modal.open().then(
      () => { throw new Error('open() should have thrown') },
      (error: Error) => expect(error.message).to.contain('no active Vfm'),
    ))
  })
})
