import { mount } from '@vue/test-utils'
import { afterTransition, createOpenedModal, createClosedModal, initDynamicModal } from './utils'
import VueFinalModal from '../../lib'
import isEqual from 'lodash.isequal'

describe('VueFinalModal.vue', () => {
  describe('default props', () => {
    it('value', async () => {
      const { wrapper } = await createOpenedModal()
      expect(wrapper.find('.vfm').isVisible()).toBe(true)
      wrapper.unmount()
    })
    it('ssr: true', async () => {
      const { wrapper } = await createClosedModal()
      expect(wrapper.find('.vfm').exists()).toBe(true)
      wrapper.unmount()
    })
    it('lockScroll: true', async () => {
      const { wrapper } = await createOpenedModal()
      expect(document.body.style.overflow).toBe('hidden')
      wrapper.unmount()
    })
    it('hideOverlay: false', async () => {
      const { wrapper } = await createOpenedModal()
      expect(wrapper.find('.vfm__overlay').isVisible()).toBe(true)
      wrapper.unmount()
    })
    it('clickToClose: true', async done => {
      const { wrapper } = await createOpenedModal()
      wrapper.find('.vfm__container').trigger('click')
      afterTransition(() => {
        expect(wrapper.find('.vfm').isVisible()).toBe(false)
        wrapper.unmount()
        done()
      })
    })
    it('escToClose: false', async done => {
      const { wrapper } = await createOpenedModal()
      wrapper.find('.vfm__container').trigger('keydown.esc')
      afterTransition(() => {
        expect(wrapper.find('.vfm').isVisible()).toBe(true)
        wrapper.unmount()
        done()
      })
    })
    it('preventClick: false', async () => {
      const { wrapper } = await createOpenedModal()
      expect(wrapper.find('.vfm').classes('vfm--prevent-none')).toBe(false)
      expect(wrapper.find('.vfm__content').classes('vfm--prevent-auto')).toBe(false)
      wrapper.unmount()
    })
    it('focusRetain: true', async () => {
      const { wrapper } = await createOpenedModal()
      expect(document.activeElement === wrapper.find('.vfm__container').element).toBe(true)
      wrapper.unmount()
    })
  })
  describe('specific props', () => {
    it('lockScroll: false', async () => {
      const { wrapper } = await createOpenedModal({
        lockScroll: false
      })
      expect(document.body.style.overflow).not.toBe('hidden')
      wrapper.unmount()
    })
    it('ssr: false', async () => {
      const { wrapper } = await createClosedModal({
        ssr: false
      })
      expect(wrapper.find('.vfm').exists()).toBe(false)
      wrapper.unmount()
    })
    it('classes', async () => {
      const testClass = 'test-class'
      const { wrapper } = await createClosedModal({
        classes: testClass
      })
      expect(wrapper.find('.vfm__container').classes()).toContain(testClass)
      wrapper.unmount()
    })
    it('styles', async () => {
      const testStyle = 'background: rgb(255, 255, 255);'
      const { wrapper } = await createClosedModal({
        styles: testStyle
      })
      expect(wrapper.find('.vfm__container').attributes('style')).toContain(testStyle)
      wrapper.unmount()
    })
    it('overlayClass', async () => {
      const testClass = 'test-class'
      const { wrapper } = await createOpenedModal({
        overlayClass: testClass
      })
      expect(wrapper.find('.vfm__overlay').classes()).toContain(testClass)
      wrapper.unmount()
    })
    it('overlayStyle', async () => {
      const testStyle = 'background: rgb(255, 255, 255);'
      const { wrapper } = await createOpenedModal({
        overlayStyle: testStyle
      })
      expect(wrapper.find('.vfm__overlay').attributes('style')).toContain(testStyle)
      wrapper.unmount()
    })
    it('contentClass', async () => {
      const testClass = 'test-class'
      const { wrapper } = await createClosedModal({
        contentClass: testClass
      })
      expect(wrapper.find('.vfm__content').classes()).toContain(testClass)
      wrapper.unmount()
    })
    it('contentStyle', async () => {
      const testStyle = 'background: rgb(255, 255, 255);'
      const { wrapper } = await createClosedModal({
        contentStyle: testStyle
      })
      expect(wrapper.find('.vfm__content').attributes('style')).toContain(testStyle)
      wrapper.unmount()
    })
    it('hideOverlay: true', async () => {
      const { wrapper } = await createOpenedModal({
        hideOverlay: true
      })
      expect(wrapper.find('.vfm__overlay').exists()).toBe(false)
      wrapper.unmount()
    })
    it('clickToClose: false', async done => {
      const { wrapper } = await createOpenedModal({
        clickToClose: false
      })
      wrapper.find('.vfm__container').trigger('click')
      afterTransition(() => {
        expect(wrapper.find('.vfm').isVisible()).toBe(true)
        wrapper.unmount()
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
        wrapper.unmount()
        done()
      })
    })
    it('preventClick: true', async () => {
      const { wrapper } = await createOpenedModal({
        preventClick: true
      })
      expect(wrapper.find('.vfm').classes('vfm--prevent-none')).toBe(true)
      expect(wrapper.find('.vfm__content').classes('vfm--prevent-auto')).toBe(true)
      wrapper.unmount()
    })
    it('attach: HTMLElement', async () => {
      const elem = document.createElement('div')
      document.body.appendChild(elem)
      const { wrapper } = await createOpenedModal({
        attach: elem
      })
      expect(wrapper.vm.$el.parentNode === elem).toBe(true)
      wrapper.unmount()
    })
    it('attach: querySelector', async () => {
      const elem = document.createElement('div')
      elem.className = 'attach-to-here'
      document.body.appendChild(elem)
      const { wrapper } = await createOpenedModal({
        attach: '.attach-to-here'
      })
      expect(wrapper.vm.$el.parentNode === elem).toBe(true)
      wrapper.unmount()
    })
    it('focusRetain: false', async () => {
      const { wrapper } = await createOpenedModal({
        focusRetain: false
      })
      expect(document.activeElement === wrapper.find('.vfm__container').element).toBe(false)
      wrapper.unmount()
    })
    it('focusTrap: true', async done => {
      const { wrapper } = await createOpenedModal({
        focusTrap: true
      })
      expect(document.activeElement === wrapper.find('.vfm__container').element).toBe(true)
      wrapper.setProps({ modelValue: false })
      afterTransition(() => {
        expect(wrapper.find('.vfm').isVisible()).toBe(false)
        wrapper.unmount()
        done()
      })
    })
    it('zIndexAuto', async () => {
      const { wrapper } = await createOpenedModal({
        zIndexAuto: false
      })
      expect(wrapper.attributes('style')).not.toContain('z-index')
      wrapper.unmount()
    })
    it('zIndexBase', async () => {
      const zIndexBase = 2000
      const zIndexStyle = `z-index: ${zIndexBase};`
      const { wrapper } = await createOpenedModal({
        zIndexBase: zIndexBase
      })
      expect(wrapper.attributes('style')).toContain(zIndexStyle)
      wrapper.unmount()
    })
    it('zIndex', async () => {
      const zIndex = 3000
      const zIndexStyle = `z-index: ${zIndex};`
      const { wrapper } = await createOpenedModal({
        zIndex
      })
      expect(wrapper.attributes('style')).toContain(zIndexStyle)
      wrapper.unmount()
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
        wrapper.unmount()
        done()
      })
    })
    it('show dynamic modal', async done => {
      const { wrapper, $vfm } = await initDynamicModal()
      const dynamicOptions = {}
      $vfm.show(dynamicOptions)
      afterTransition(() => {
        expect(wrapper.find('.vfm').exists()).toBe(true)
        wrapper.unmount()
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
        wrapper.unmount()
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
          wrapper.unmount()
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
          wrapper.unmount()
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
        wrapper.unmount()
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
        wrapper.unmount()
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
          wrapper.unmount()
          done()
        })
      })
    })
    it('get modals', async done => {
      const { wrapper, $vfm } = await initDynamicModal()
      $vfm.show({ bind: { name: 'testModal1' } })
      $vfm.show({ bind: { name: 'testModal2' } })
      afterTransition(() => {
        expect($vfm.get('testModal1').length).toBe(1)
        wrapper.unmount()
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
          onClickOutside() {
            clickOutside()
          },
          onBeforeOpen() {
            beforeOpen()
          },
          onOpened() {
            opened()
          },
          onBeforeClose() {
            beforeClose()
          },
          onClosed() {
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
        wrapper.unmount()
        done()
      })
    })

    it('stop beforeOpen', async done => {
      const { wrapper } = await createClosedModal(
        {},
        {
          onBeforeOpen(event) {
            event.stop()
          }
        }
      )
      wrapper.setProps({ modelValue: true })
      afterTransition(() => {
        expect(wrapper.find('.vfm').isVisible()).toBe(false)
        wrapper.unmount()
        done()
      })
    })

    it('stop beforeClose', async done => {
      const { wrapper } = await createOpenedModal(
        {},
        {
          onBeforeClose(event) {
            event.stop()
          }
        }
      )
      wrapper.setProps({ modelValue: false })
      afterTransition(() => {
        expect(wrapper.find('.vfm').isVisible()).toBe(true)
        wrapper.unmount()
        done()
      })
    })

    it('avoid modal reset params after modal was closed', async done => {
      const { wrapper, $vfm } = await createClosedModal(
        {
          name: 'testModal'
        },
        {
          onClosed(event) {
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
          expect(isEqual(wrapper.findComponent('.vfm').vm.params, params)).toBe(true)
          done()
        })
      })
    })
  })

  describe('Plugin', () => {
    it('Register multiple plugins', async done => {
      global.console = {
        ...global.console,
        error: jest.fn()
      }
      const spy = jest.spyOn(global.console, 'error')
      mount(
        { template: '<div></div>' },
        {
          global: {
            plugins: [
              VueFinalModal(),
              [
                VueFinalModal(),
                {
                  componentName: 'VueFinalTest',
                  dynamicContainerName: 'TestContainer',
                  key: '$vtm'
                }
              ]
            ]
          }
        }
      )
      expect(spy).toHaveBeenCalledTimes(0)
      done()
    })
    it('Register duplicate plugins', async done => {
      global.console = {
        ...global.console,
        error: jest.fn()
      }
      const spy = jest.spyOn(global.console, 'error')
      mount(
        { template: '<div></div>' },
        {
          global: {
            plugins: [VueFinalModal(), VueFinalModal()]
          }
        }
      )
      expect(spy).toHaveBeenCalledTimes(3)
      done()
    })
  })
})
