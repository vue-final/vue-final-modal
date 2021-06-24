import { createLocalVue, mount } from '@vue/test-utils'
import { vfmPlugin } from '../../lib'

export function afterTransition(transitionDelay = 60) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, transitionDelay)
  })
}

export const transitionStub = () => ({
  render: function() {
    return this.$options._renderChildren
  }
})

export function createOpenedModal(propsData = {}, listeners = {}, mountingOptions = {}) {
  const localVue = createLocalVue()
  localVue.use(vfmPlugin)
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
export function createClosedModal(propsData = {}, listeners = {}, mountingOptions = {}, stubs = false) {
  const localVue = createLocalVue()
  localVue.use(vfmPlugin)
  return new Promise(resolve => {
    const wrapper = mount(localVue.options.components.VueFinalModal, {
      stubs,
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
    localVue.use(vfmPlugin)
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
