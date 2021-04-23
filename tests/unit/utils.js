import { mount } from '@vue/test-utils'
import VueFinalModal from '../../lib'

export function afterTransition(transitionDelay = 65) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, transitionDelay)
  })
}

const vfm = {
  template: `<vue-final-modal v-bind="$attrs"></vue-final-modal>`,
  inheritAttrs: false
}

export function createOpenedModal(props = {}, attrs = {}, mountingOptions = {}) {
  return new Promise(resolve => {
    const elem = document.createElement('div')
    if (document.body) {
      document.body.appendChild(elem)
    }
    const wrapper = mount(vfm, {
      props: {
        modelValue: true,
        ...props
      },
      attrs: {
        input: val => {
          wrapper.setProps({ modelValue: val })
        },
        ...attrs,
        onOpened() {
          if (attrs.onOpened) {
            attrs.onOpened()
          }
          resolve({ wrapper, $vfm: wrapper.__app._context.provides.$vfm })
        }
      },
      global: {
        plugins: [VueFinalModal()],
        stubs: { transition: false }
      },
      attachTo: (() => {
        const elem = document.createElement('div')
        if (document.body) {
          document.body.appendChild(elem)
        }
        return elem
      })(),
      ...mountingOptions
    })
  })
}

export function createClosedModal(props = {}, attrs = {}, mountingOptions = {}) {
  return new Promise(resolve => {
    const wrapper = mount(vfm, {
      props: {
        modelValue: false,
        ...props
      },
      global: {
        plugins: [VueFinalModal()],
        stubs: { transition: false }
      },
      attrs,
      ...mountingOptions
    })
    resolve({ wrapper, $vfm: wrapper.__app._context.provides.$vfm })
  })
}

export function initDynamicModal() {
  return new Promise(resolve => {
    const wrapper = mount(
      {
        template: `
            <div>
              <modals-container></modals-container>
            </div>
          `
      },
      {
        global: {
          plugins: [VueFinalModal()],
          stubs: { transition: false }
        }
      }
    )
    resolve({ wrapper, $vfm: wrapper.__app._context.provides.$vfm })
  })
}
