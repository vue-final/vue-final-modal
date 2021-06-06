import { enableAutoDestroy } from '@vue/test-utils'
import { afterTransition, createClosedModal, createOpenedModal, initDynamicModal, transitionStub } from './utils'

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
    it('clickToClose: true', async () => {
      const { wrapper } = await createOpenedModal()
      wrapper.find('.vfm__container').trigger('mousedown')
      wrapper.find('.vfm__content').trigger('mouseup')
      await afterTransition()
      expect(wrapper.find('.vfm').isVisible()).toBe(true)
      wrapper.find('.vfm__content').trigger('mousedown')
      wrapper.find('.vfm__container').trigger('mouseup')
      await afterTransition()
      expect(wrapper.find('.vfm').isVisible()).toBe(true)
      wrapper.find('.vfm__container').trigger('mousedown')
      wrapper.find('.vfm__container').trigger('mouseup')
      await afterTransition()
      expect(wrapper.find('.vfm').isVisible()).toBe(false)
    })
    it('escToClose: false', async () => {
      const { wrapper } = await createOpenedModal()
      wrapper.find('.vfm__container').trigger('keydown.esc')
      await afterTransition()
      expect(wrapper.find('.vfm').isVisible()).toBe(true)
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
      const testStyle = { background: 'rgb(255, 255, 255)' }
      const { wrapper } = await createClosedModal({
        styles: testStyle
      })
      expect(wrapper.find('.vfm__container').attributes('style')).toContain('background: rgb(255, 255, 255)')
    })
    it('overlayClass', async () => {
      const testClass = 'test-class'
      const { wrapper } = await createClosedModal({
        overlayClass: testClass
      })
      expect(wrapper.find('.vfm__overlay').classes()).toContain(testClass)
    })
    it('overlayStyle', async () => {
      const testStyle = { background: 'rgb(255, 255, 255)' }
      const { wrapper } = await createClosedModal({
        overlayStyle: testStyle
      })
      expect(wrapper.find('.vfm__overlay').attributes('style')).toContain('background: rgb(255, 255, 255)')
    })
    it('contentClass', async () => {
      const testClass = 'test-class'
      const { wrapper } = await createClosedModal({
        contentClass: testClass
      })
      expect(wrapper.find('.vfm__content').classes()).toContain(testClass)
    })
    it('contentStyle with object', async () => {
      const testStyle = { background: 'rgb(255, 255, 255)' }
      const { wrapper } = await createOpenedModal({
        contentStyle: testStyle
      })
      const style = wrapper.find('.vfm__content').attributes('style')
      Object.keys(testStyle).forEach(key => {
        expect(style).toContain(`${key}: ${testStyle[key]};`)
      })
    })
    it('contentStyle with array object', async () => {
      const testStyle = [{ background: 'rgb(255, 255, 255)' }]
      const { wrapper } = await createOpenedModal({
        contentStyle: testStyle
      })
      const style = wrapper.find('.vfm__content').attributes('style')
      testStyle.forEach(item => {
        Object.keys(item).forEach(key => {
          expect(style).toContain(`${key}: ${item[key]};`)
        })
      })
    })
    it('hideOverlay: true', async () => {
      const { wrapper } = await createOpenedModal({
        hideOverlay: true
      })
      expect(wrapper.find('.vfm__overlay').isVisible()).toBe(false)
      wrapper.setProps({ hideOverlay: false })
      await afterTransition()
      expect(wrapper.find('.vfm__overlay').isVisible()).toBe(true)
      wrapper.setProps({ hideOverlay: true })
      await afterTransition()
      expect(wrapper.find('.vfm__overlay').isVisible()).toBe(false)
    })
    it('clickToClose: false', async () => {
      const { wrapper } = await createOpenedModal({
        clickToClose: false
      })
      wrapper.find('.vfm__container').trigger('mousedown')
      wrapper.find('.vfm__container').trigger('mouseup')
      await afterTransition()
      expect(wrapper.find('.vfm').isVisible()).toBe(true)
    })
    it('escToClose: true', async () => {
      const { wrapper } = await createOpenedModal({
        escToClose: true
      })
      wrapper.find('.vfm__container').trigger('keydown.esc')
      await afterTransition()
      expect(wrapper.find('.vfm').isVisible()).toBe(false)
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
    it('attach: wrong querySelector', async () => {
      global.console.warn = jest.fn()
      const spy = jest.spyOn(global.console, 'warn')
      const attach = '.selector-not-exist-in-dom'
      const { wrapper } = await createClosedModal({
        attach
      })
      wrapper.setProps({ value: true })
      await afterTransition()
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy.mock.calls[0][0]).toContain(attach)
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
      wrapper.setProps({ value: false })
      await afterTransition()
      expect(wrapper.find('.vfm').isVisible()).toBe(false)
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
    it('transition is string', async () => {
      const transition = 'vfm-test-transition'
      const { wrapper } = await createClosedModal(
        {
          transition
        },
        {},
        {},
        { transition: transitionStub() }
      )
      const transitionComponent = wrapper
        .findComponent({
          ref: 'vfmTransition'
        })
        .attributes()
      expect(transitionComponent.name).toEqual(transition)
    })
    it('transition is an object', async () => {
      const transition = {
        'enter-active-class': 'transition duration-200 ease-in-out transform',
        'enter-class': 'translate-y-full',
        'enter-to-class': 'translate-y-0',
        'leave-active-class': 'transition duration-200 ease-in-out transform',
        'leave-to-class': 'translate-y-full',
        'leave-class': 'translate-y-0'
      }
      const { wrapper } = await createClosedModal(
        {
          transition
        },
        {},
        {},
        { transition: transitionStub() }
      )
      const transitionComponent = wrapper
        .findComponent({
          ref: 'vfmTransition'
        })
        .attributes()
      expect(transitionComponent).toEqual(expect.objectContaining(transition))
    })
    it('overlayTransition is string', async () => {
      const overlayTransition = 'vfm-test-overlay-transition'
      const { wrapper } = await createClosedModal(
        {
          overlayTransition
        },
        {},
        {},
        { transition: transitionStub() }
      )
      const transitionComponent = wrapper
        .findComponent({
          ref: 'vfmOverlayTransition'
        })
        .attributes()
      expect(transitionComponent.name).toEqual(overlayTransition)
    })
    it('overlayTransition is an object', async () => {
      const overlayTransition = {
        'enter-active-class': 'transition duration-200 ease-in-out transform',
        'enter-class': 'translate-y-full',
        'enter-to-class': 'translate-y-0',
        'leave-active-class': 'transition duration-200 ease-in-out transform',
        'leave-to-class': 'translate-y-full',
        'leave-class': 'translate-y-0'
      }
      const { wrapper } = await createClosedModal(
        {
          overlayTransition
        },
        {},
        {},
        { transition: transitionStub() }
      )

      const transitionComponent = wrapper
        .findComponent({
          ref: 'vfmOverlayTransition'
        })
        .attributes()
      expect(transitionComponent).toEqual(expect.objectContaining(overlayTransition))
    })
  })

  describe('API', () => {
    it('show static modal', async () => {
      const { wrapper, $vfm } = await createClosedModal({
        name: 'testModal'
      })
      await $vfm.show('testModal')
      expect(wrapper.find('.vfm').isVisible()).toBe(true)
    })
    it('show dynamic modal', async () => {
      const { wrapper, $vfm } = await initDynamicModal()
      const dynamicOptions = {}
      await $vfm.show(dynamicOptions)
      expect(wrapper.find('.vfm').exists()).toBe(true)
    })
    it('show dynamic modal with string slot', async () => {
      const { wrapper, $vfm } = await initDynamicModal()
      const string = 'testVModal'
      const dynamicOptions = {
        slots: {
          default: string
        }
      }
      await $vfm.show(dynamicOptions)
      expect(wrapper.find('.vfm').html()).toContain(string)
    })
    it('stop show dynamic modal', async () => {
      const { wrapper, $vfm } = await initDynamicModal()
      const dynamicOptions = {
        on: {
          'before-open'(e) {
            e.stop()
          }
        }
      }
      await $vfm.show(dynamicOptions)
      expect(wrapper.find('.vfm').exists()).toBe(false)
    })
    it('hide modal', async () => {
      const { wrapper, $vfm } = await createOpenedModal({
        name: 'testModal'
      })
      await $vfm.hide('testModal')
      expect(wrapper.find('.vfm').isVisible()).toBe(false)
    })
    it('hide modals', async () => {
      const { wrapper, $vfm } = await initDynamicModal()
      await $vfm.show({ bind: { name: 'modal1' } })
      await $vfm.show({ bind: { name: 'modal2' } })
      await $vfm.hide('modal1', 'modal2')
      expect(wrapper.find('.vfm').exists()).toBe(false)
    })
    it('stop hide modal', async () => {
      const { wrapper, $vfm } = await initDynamicModal()
      const dynamicOptions = {
        bind: {
          name: 'modal1'
        },
        on: {
          'before-close'(e) {
            e.stop()
          }
        }
      }
      await $vfm.show(dynamicOptions)
      await $vfm.hide('modal1')
      expect(wrapper.find('.vfm').exists()).toBe(true)
    })
    it('hide all modals', async () => {
      const { wrapper, $vfm } = await initDynamicModal()
      await $vfm.show({ bind: { name: 'modal1' } })
      await $vfm.show({ bind: { name: 'modal2' } })
      await $vfm.hideAll()
      expect(wrapper.find('.vfm').exists()).toBe(false)
    })
    it('toggle opened modal', async () => {
      const { wrapper, $vfm } = await createOpenedModal({
        name: 'testModal'
      })
      await $vfm.toggle('testModal', false)
      expect(wrapper.find('.vfm').isVisible()).toBe(false)
    })
    it('toggle closed modal', async () => {
      const { wrapper, $vfm } = await createClosedModal({
        name: 'testModal'
      })
      await $vfm.toggle('testModal', true)
      expect(wrapper.find('.vfm').isVisible()).toBe(true)
    })
    it('toggle dynamic modal', async () => {
      const { wrapper, $vfm } = await initDynamicModal()
      await $vfm.show({ bind: { name: 'testModal' } })
      await $vfm.toggle('testModal')
      expect(wrapper.find('.vfm').exists()).toBe(false)
    })
    it('get modals', async () => {
      const { $vfm } = await initDynamicModal()
      await $vfm.show({ bind: { name: 'testModal1' } })
      await $vfm.show({ bind: { name: 'testModal2' } })
      expect($vfm.get('testModal1').length).toBe(1)
    })
  })

  describe('events', () => {
    it('all events', async () => {
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
      wrapper.find('.vfm__container').trigger('mousedown')
      wrapper.find('.vfm__container').trigger('mouseup')
      await afterTransition()
      expect(clickOutside).toHaveBeenCalled()
      expect(beforeOpen).toHaveBeenCalled()
      expect(opened).toHaveBeenCalled()
      expect(beforeClose).toHaveBeenCalled()
      expect(closed).toHaveBeenCalled()
    })

    it('stop beforeOpen', async () => {
      const { wrapper } = await createClosedModal(
        {},
        {
          'before-open'(event) {
            event.stop()
          }
        }
      )
      wrapper.setProps({ value: true })
      await afterTransition()
      expect(wrapper.find('.vfm').isVisible()).toBe(false)
    })

    it('stop beforeClose', async () => {
      const { wrapper } = await createOpenedModal(
        {},
        {
          'before-close'(event) {
            event.stop()
          }
        }
      )
      wrapper.setProps({ value: false })
      await afterTransition()
      expect(wrapper.find('.vfm').isVisible()).toBe(true)
    })

    it('avoid modal reset params after modal was closed', async () => {
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
      await $vfm.show('testModal', params)
      await $vfm.hide('testModal')
      expect(wrapper.vm.params === params).toBe(true)
    })
  })
})
