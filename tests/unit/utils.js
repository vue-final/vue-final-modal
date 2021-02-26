import { createLocalVue, mount } from '@vue/test-utils'
import VueFinalModal from '../../lib'

export function afterTransition(callback, transitionDelay = 60) {
  setTimeout(() => {
    callback()
  }, transitionDelay)
}

export function createOpenedModal(propsData = {}, listeners = {}, mountingOptions = {}) {
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
        input: val => {
          wrapper.setProps({ value: val })
        },
        ...listeners,
        opened: () => {
          if (listeners.opened) {
            listeners.opened()
          }
          resolve({ wrapper, localVue, $vfm: localVue.prototype.$vfm })
        }
      },
      attachTo: elem,
      ...mountingOptions
    })
  })
}
export function createClosedModal(propsData = {}, listeners = {}, mountingOptions = {}) {
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
      listeners: {
        input: val => {
          wrapper.setProps({ value: val })
        },
        ...listeners
      },
      ...mountingOptions
    })
    resolve({ wrapper, localVue, $vfm: localVue.prototype.$vfm })
  })
}

export function initDynamicModal() {
  return new Promise(resolve => {
    const localVue = createLocalVue()
    localVue.use(VueFinalModal())
    const wrapper = mount(
      {
        template: `
            <div>
              <modals-container></modals-container>
            </div>
          `
      },
      {
        stubs: false,
        localVue
      }
    )
    resolve({ wrapper, localVue, $vfm: localVue.prototype.$vfm })
  })
}
