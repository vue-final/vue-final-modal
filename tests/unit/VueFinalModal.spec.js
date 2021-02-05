import { createLocalVue, mount } from '@vue/test-utils'
import VueFinalModal from '../../lib'

function createOpenedModal(propsData = {}, mountingOptions = {}) {
  const localVue = createLocalVue()
  localVue.use(VueFinalModal())
  return new Promise(resolve => {
    const wrapper = mount(localVue.options.components.VueFinalModal, {
      stubs: false,
      localVue,
      propsData: {
        value: true,
        ...propsData
      },
      listeners: {
        opened: () => resolve({ wrapper, localVue })
      },
      ...mountingOptions
    })
  })
}

describe('VueFinalModal.vue', () => {
  describe('props', () => {
    it('value', async () => {
      const { wrapper } = await createOpenedModal()
      expect(wrapper.find('.vfm').isVisible()).toBe(true)
    })
    it('lockScroll: true', async () => {
      await createOpenedModal({
        lockScroll: true
      })
      expect(document.body.style.overflow).toBe('hidden')
    })
    it('lockScroll: false', async () => {
      await createOpenedModal({
        lockScroll: false
      })
      expect(document.body.style.overflow).not.toBe('hidden')
    })
  })
})
