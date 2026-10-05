import { defineComponent, h, ref } from 'vue'
import App from './App.vue'
import VueFinalModal from '~/components/VueFinalModal.vue'
import { createVfm, useModal } from '~/index'

let renders = 0

const TitledModal = defineComponent({
  props: { title: String },
  setup: props => () => {
    renders++
    return h(VueFinalModal, null, { default: () => props.title })
  },
})

describe('Test useModal() rendering', () => {
  it('Should not re-render an open modal when another modal opens', () => {
    const vfm = createVfm()
    const first = useModal({
      component: TitledModal,
      attrs: { title: 'First modal' },
    })
    const second = useModal({
      component: VueFinalModal,
      slots: { default: 'Second modal' },
    })

    cy.mount(App, {
      global: {
        plugins: [vfm],
        stubs: { transition: false },
      },
    }).as('app')

    cy.get('@app').then(() => first.open())
    cy.contains('First modal').then(() => {
      renders = 0
    })
    cy.get('@app').then(() => second.open())
    cy.contains('Second modal').then(() => {
      expect(renders).to.equal(0)
    })
  })

  it('Should update an open modal when its reactive attrs change', () => {
    const vfm = createVfm()
    const title = ref('Before')
    const modal = useModal({
      component: TitledModal,
      attrs: () => ({ title: title.value }),
    })

    cy.mount(App, {
      global: {
        plugins: [vfm],
        stubs: { transition: false },
      },
    }).as('app')

    cy.get('@app').then(() => modal.open())
    cy.contains('Before').then(() => {
      title.value = 'After'
    })
    cy.contains('After').should('exist')
  })

  it('Should apply props given as a getter', () => {
    const vfm = createVfm()
    const title = ref('Before')
    const modal = useModal({
      component: TitledModal,
      props: () => ({ title: title.value }),
    })

    cy.mount(App, {
      global: {
        plugins: [vfm],
        stubs: { transition: false },
      },
    }).as('app')

    cy.get('@app').then(() => modal.open())
    cy.contains('Before').then(() => {
      title.value = 'After'
    })
    cy.contains('After').should('exist')
  })
})
