import { createLocalVue, mount, enableAutoDestroy } from '@vue/test-utils'
import VueFinalModal from '../../lib'

enableAutoDestroy(afterEach)

function createOpenedModal(propsData = {}, listeners = {}, mountingOptions = {}) {
  const localVue = createLocalVue()
  localVue.use(VueFinalModal())
  return new Promise(resolve => {
    const elem = document.createElement('div')
    if (document.body) {
      document.body.appendChild(elem)
    }
    const wrapper = mount(localVue.options.components.VueFinalModal, {
      stubs: false,
      localVue,
      propsData: {
        value: true,
        ...propsData
      },
      listeners: {
        opened: () => resolve({ wrapper, localVue }),
        input: val => {
          wrapper.setProps({ value: val })
        },
        ...listeners
      },
      attachTo: elem,
      ...mountingOptions
    })
  })
}
function createClosedModal(propsData = {}, mountingOptions = {}) {
  const localVue = createLocalVue()
  localVue.use(VueFinalModal())
  return new Promise(resolve => {
    const wrapper = mount(localVue.options.components.VueFinalModal, {
      stubs: false,
      localVue,
      propsData: {
        value: false,
        ...propsData
      },
      ...mountingOptions
    })
    resolve({ wrapper, localVue })
  })
}

describe('VueFinalModal.vue', () => {
  describe('default props', () => {
    it('value', async () => {
      const { wrapper } = await createOpenedModal()
      expect(wrapper.find('.vfm').isVisible()).toBe(true)
    })
    it('ssr: true', async () => {
      const { wrapper } = await createClosedModal()
      expect(wrapper.find('.vfm').exists()).toBe(true)
    })
    it('lockScroll: true', async () => {
      await createOpenedModal()
      expect(document.body.style.overflow).toBe('hidden')
    })
    it('hideOverlay: false', async () => {
      const { wrapper } = await createOpenedModal()
      expect(wrapper.find('.vfm__overlay').isVisible()).toBe(true)
    })
    it('clickToClose: true', async done => {
      const { wrapper } = await createOpenedModal()
      wrapper.find('.vfm__container').trigger('click')
      setTimeout(() => {
        expect(wrapper.find('.vfm').isVisible()).toBe(false)
        done()
      }, 200)
    })
    it('escToClose: false', async done => {
      const { wrapper } = await createOpenedModal()
      wrapper.find('.vfm__container').trigger('keydown.esc')
      setTimeout(() => {
        expect(wrapper.find('.vfm').isVisible()).toBe(true)
        done()
      }, 200)
    })
    it('preventClick: false', async () => {
      const { wrapper } = await createOpenedModal()
      expect(wrapper.find('.vfm').classes('vfm--prevent-none')).toBe(false)
      expect(wrapper.find('.vfm__content').classes('vfm--prevent-auto')).toBe(false)
    })
    it('focusRetain: true', async () => {
      const { wrapper } = await createOpenedModal()
      expect(document.activeElement === wrapper.find('.vfm__container').vm.$el).toBe(true)
    })
  })
  describe('specific props', () => {
    it('lockScroll: false', async () => {
      await createOpenedModal({
        lockScroll: false
      })
      expect(document.body.style.overflow).not.toBe('hidden')
    })
    it('ssr: false', async () => {
      const { wrapper } = await createClosedModal({
        ssr: false
      })
      expect(wrapper.find('.vfm').exists()).toBe(false)
    })
    it('classes', async () => {
      const testClass = 'test-class'
      const { wrapper } = await createClosedModal({
        classes: testClass
      })
      expect(wrapper.find('.vfm__container').classes()).toContain(testClass)
    })
    it('styles', async () => {
      const testStyle = 'background: rgb(255, 255, 255);'
      const { wrapper } = await createClosedModal({
        styles: testStyle
      })
      expect(wrapper.find('.vfm__container').attributes('style')).toContain(testStyle)
    })
    it('overlayClass', async () => {
      const testClass = 'test-class'
      const { wrapper } = await createClosedModal({
        overlayClass: testClass
      })
      expect(wrapper.find('.vfm__overlay').classes()).toContain(testClass)
    })
    it('overlayStyle', async () => {
      const testStyle = 'background: rgb(255, 255, 255);'
      const { wrapper } = await createClosedModal({
        overlayStyle: testStyle
      })
      expect(wrapper.find('.vfm__overlay').attributes('style')).toContain(testStyle)
    })
    it('contentClass', async () => {
      const testClass = 'test-class'
      const { wrapper } = await createClosedModal({
        contentClass: testClass
      })
      expect(wrapper.find('.vfm__content').classes()).toContain(testClass)
    })
    it('contentStyle', async () => {
      const testStyle = 'background: rgb(255, 255, 255);'
      const { wrapper } = await createClosedModal({
        contentStyle: testStyle
      })
      expect(wrapper.find('.vfm__content').attributes('style')).toContain(testStyle)
    })
    it('hideOverlay: true', async () => {
      const { wrapper } = await createOpenedModal({
        hideOverlay: true
      })
      expect(wrapper.find('.vfm__overlay').isVisible()).toBe(false)
    })
    it('clickToClose: false', async done => {
      const { wrapper } = await createOpenedModal({
        clickToClose: false
      })
      wrapper.find('.vfm__container').trigger('click')
      setTimeout(() => {
        expect(wrapper.find('.vfm').isVisible()).toBe(true)
        done()
      }, 200)
    })
    it('escToClose: false', async done => {
      const { wrapper } = await createOpenedModal({
        escToClose: true
      })
      wrapper.find('.vfm__container').trigger('keydown.esc')
      setTimeout(() => {
        expect(wrapper.find('.vfm').isVisible()).toBe(false)
        done()
      }, 200)
    })
    it('preventClick: true', async () => {
      const { wrapper } = await createOpenedModal({
        preventClick: true
      })
      expect(wrapper.find('.vfm').classes('vfm--prevent-none')).toBe(true)
      expect(wrapper.find('.vfm__content').classes('vfm--prevent-auto')).toBe(true)
    })
    it('attach: body', async () => {
      const elem = document.createElement('div')
      document.body.appendChild(elem)
      const { wrapper } = await createOpenedModal({
        attach: elem
      })
      expect(wrapper.vm.$el.parentNode === elem).toBe(true)
    })
    it('focusRetain: false', async () => {
      const { wrapper } = await createOpenedModal({
        focusRetain: false
      })
      expect(document.activeElement === wrapper.find('.vfm__container').vm.$el).toBe(false)
    })
    it('focusTrap: true', async () => {
      const { wrapper } = await createOpenedModal({
        focusTrap: true
      })
      expect(document.activeElement === wrapper.find('.vfm__container').vm.$el).toBe(true)
    })
  })
})
