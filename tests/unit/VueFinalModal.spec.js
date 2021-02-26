import { createLocalVue, enableAutoDestroy } from '@vue/test-utils'
import { afterTransition, createOpenedModal, createClosedModal, initDynamicModal } from './utils'
import VueFinalModal from '../../lib'

enableAutoDestroy(afterEach)

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
      afterTransition(() => {
        expect(wrapper.find('.vfm').isVisible()).toBe(false)
        done()
      })
    })
    it('escToClose: false', async done => {
      const { wrapper } = await createOpenedModal()
      wrapper.find('.vfm__container').trigger('keydown.esc')
      afterTransition(() => {
        expect(wrapper.find('.vfm').isVisible()).toBe(true)
        done()
      })
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
      afterTransition(() => {
        expect(wrapper.find('.vfm').isVisible()).toBe(true)
        done()
      })
    })
    it('escToClose: false', async done => {
      const { wrapper } = await createOpenedModal({
        escToClose: true
      })
      wrapper.find('.vfm__container').trigger('keydown.esc')
      afterTransition(() => {
        expect(wrapper.find('.vfm').isVisible()).toBe(false)
        done()
      })
    })
    it('preventClick: true', async () => {
      const { wrapper } = await createOpenedModal({
        preventClick: true
      })
      expect(wrapper.find('.vfm').classes('vfm--prevent-none')).toBe(true)
      expect(wrapper.find('.vfm__content').classes('vfm--prevent-auto')).toBe(true)
    })
    it('attach: HTMLElement', async () => {
      const elem = document.createElement('div')
      document.body.appendChild(elem)
      const { wrapper } = await createOpenedModal({
        attach: elem
      })
      expect(wrapper.vm.$el.parentNode === elem).toBe(true)
    })
    it('attach: querySelector', async () => {
      const elem = document.createElement('div')
      elem.className = 'attach-to-here'
      document.body.appendChild(elem)
      const { wrapper } = await createOpenedModal({
        attach: '.attach-to-here'
      })
      expect(wrapper.vm.$el.parentNode === elem).toBe(true)
    })
    it('focusRetain: false', async () => {
      const { wrapper } = await createOpenedModal({
        focusRetain: false
      })
      expect(document.activeElement === wrapper.find('.vfm__container').vm.$el).toBe(false)
    })
    it('focusTrap: true', async done => {
      const { wrapper } = await createOpenedModal({
        focusTrap: true
      })
      expect(document.activeElement === wrapper.find('.vfm__container').vm.$el).toBe(true)
      wrapper.setProps({ value: false })
      afterTransition(() => {
        expect(wrapper.find('.vfm').isVisible()).toBe(false)
        done()
      })
    })
    it('zIndexAuto', async () => {
      const { wrapper } = await createOpenedModal({
        zIndexAuto: false
      })
      expect(wrapper.attributes('style')).not.toContain('z-index')
    })
    it('zIndexBase', async () => {
      const zIndexBase = 2000
      const zIndexStyle = `z-index: ${zIndexBase};`
      const { wrapper } = await createOpenedModal({
        zIndexBase: zIndexBase
      })
      expect(wrapper.attributes('style')).toContain(zIndexStyle)
    })
    it('zIndex', async () => {
      const zIndex = 3000
      const zIndexStyle = `z-index: ${zIndex};`
      const { wrapper } = await createOpenedModal({
        zIndex
      })
      expect(wrapper.attributes('style')).toContain(zIndexStyle)
    })
  })

  describe('API', () => {
    it('show static modal', async done => {
      const { wrapper, $vfm } = await createClosedModal({
        name: 'testModal'
      })
      $vfm.show('testModal')
      afterTransition(() => {
        expect(wrapper.find('.vfm').isVisible()).toBe(true)
        done()
      })
    })
    it('show dynamic modal', async done => {
      const { wrapper, $vfm } = await initDynamicModal()
      const dynamicOptions = {}
      $vfm.show(dynamicOptions)
      afterTransition(() => {
        expect(wrapper.find('.vfm').exists()).toBe(true)
        done()
      })
    })
    it('hide modal', async done => {
      const { wrapper, $vfm } = await createOpenedModal({
        name: 'testModal'
      })
      $vfm.hide('testModal')
      afterTransition(() => {
        expect(wrapper.find('.vfm').isVisible()).toBe(false)
        done()
      })
    })
    it('hide modals', async done => {
      const { wrapper, $vfm } = await initDynamicModal()
      $vfm.show({ bind: { name: 'modal1' } })
      $vfm.show({ bind: { name: 'modal2' } })
      afterTransition(() => {
        $vfm.hide('modal1', 'modal2')
        afterTransition(() => {
          expect(wrapper.find('.vfm').exists()).toBe(false)
          done()
        })
      })
    })
    it('hide all modals', async done => {
      const { wrapper, $vfm } = await initDynamicModal()
      $vfm.show({ bind: { name: 'modal1' } })
      $vfm.show({ bind: { name: 'modal2' } })
      afterTransition(() => {
        $vfm.hideAll()
        afterTransition(() => {
          expect(wrapper.find('.vfm').exists()).toBe(false)
          done()
        })
      })
    })
    it('toggle opened modal', async done => {
      const { wrapper, $vfm } = await createOpenedModal({
        name: 'testModal'
      })
      $vfm.toggle('testModal', false)
      afterTransition(() => {
        expect(wrapper.find('.vfm').isVisible()).toBe(false)
        done()
      })
    })
    it('toggle closed modal', async done => {
      const { wrapper, $vfm } = await createClosedModal({
        name: 'testModal'
      })
      $vfm.toggle('testModal', true)
      afterTransition(() => {
        expect(wrapper.find('.vfm').isVisible()).toBe(true)
        done()
      })
    })
    it('toggle dynamic modal', async done => {
      const { wrapper, $vfm } = await initDynamicModal()
      $vfm.show({ bind: { name: 'testModal' } })
      afterTransition(() => {
        $vfm.toggle('testModal')
        afterTransition(() => {
          expect(wrapper.find('.vfm').exists()).toBe(false)
          done()
        })
      })
    })
    it('get modals', async done => {
      const { $vfm } = await initDynamicModal()
      $vfm.show({ bind: { name: 'testModal1' } })
      $vfm.show({ bind: { name: 'testModal2' } })
      afterTransition(() => {
        expect($vfm.get('testModal1').length).toBe(1)
        done()
      })
    })
  })

  describe('events', () => {
    it('all events', async done => {
      const clickOutside = jest.fn()
      const beforeOpen = jest.fn()
      const opened = jest.fn()
      const beforeClose = jest.fn()
      const closed = jest.fn()

      const { wrapper } = await createOpenedModal(
        {},
        {
          'click-outside'() {
            clickOutside()
          },
          'before-open'() {
            beforeOpen()
          },
          opened() {
            opened()
          },
          'before-close'() {
            beforeClose()
          },
          closed() {
            closed()
          }
        }
      )
      wrapper.find('.vfm__container').trigger('click')
      afterTransition(() => {
        expect(clickOutside).toHaveBeenCalled()
        expect(beforeOpen).toHaveBeenCalled()
        expect(opened).toHaveBeenCalled()
        expect(beforeClose).toHaveBeenCalled()
        expect(closed).toHaveBeenCalled()
        done()
      })
    })

    it('stop beforeOpen', async done => {
      const { wrapper } = await createClosedModal(
        {},
        {
          'before-open'(event) {
            event.stop()
          }
        }
      )
      wrapper.setProps({ value: true })
      afterTransition(() => {
        expect(wrapper.find('.vfm').isVisible()).toBe(false)
        done()
      })
    })

    it('stop beforeClose', async done => {
      const { wrapper } = await createOpenedModal(
        {},
        {
          'before-close'(event) {
            event.stop()
          }
        }
      )
      wrapper.setProps({ value: false })
      afterTransition(() => {
        expect(wrapper.find('.vfm').isVisible()).toBe(true)
        done()
      })
    })

    it('avoid modal reset params after modal was closed', async done => {
      const { wrapper, $vfm } = await createClosedModal(
        {
          name: 'testModal'
        },
        {
          closed(event) {
            event.stop()
          }
        }
      )
      const params = {
        test: 123
      }
      $vfm.show('testModal', params)
      afterTransition(() => {
        $vfm.hide('testModal')
        afterTransition(() => {
          expect(wrapper.vm.params === params).toBe(true)
          done()
        })
      })
    })
  })

  describe('Plugin', () => {
    it('Register multiple plugins', async done => {
      global.console = { error: jest.fn() }
      const spy = jest.spyOn(global.console, 'error')
      const localVue = createLocalVue()
      localVue.use(VueFinalModal())
      localVue.use(VueFinalModal(), {
        componentName: 'VueFinalTest',
        dynamicContainerName: 'TestContainer',
        key: '$vtm'
      })
      expect(spy).toHaveBeenCalledTimes(0)
      done()
    })
    it('Register duplicate plugins', async done => {
      global.console = { error: jest.fn() }
      const spy = jest.spyOn(global.console, 'error')
      const localVue = createLocalVue()
      localVue.use(VueFinalModal())
      localVue.use(VueFinalModal())
      expect(spy).toHaveBeenCalledTimes(3)
      done()
    })
  })
})
