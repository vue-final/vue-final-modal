// import { mount } from '@cypress/vue'
import VueFinalModal from '~/components/VueFinalModal/VueFinalModal.vue'
import { createVfm } from '~/plugin'

const vfm = createVfm()

it('renders the VueFinalModal', () => {
  cy.mount(VueFinalModal, {
    props: {
      modelValue: true,
    },
    slots: {
      default: '<p>Hello World!</p>',
    },
    global: {
      plugins: [vfm],
    },
  })
  cy.contains('Hello')
})
