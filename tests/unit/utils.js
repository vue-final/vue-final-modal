import { mount } from '@vue/test-utils'
import { vfmPlugin } from '../../lib'

export function afterTransition(transitionDelay = 65) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, transitionDelay)
  })
}

const vfm = {
  template: `<vue-final-modal v-bind="$attrs"><slot></slot></vue-final-modal>`,
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
        'onUpdate:modelValue': val => {
          wrapper.setProps({ modelValue: val })
        },
        ...props
      },
      attrs: {
        ...attrs,
        onOpened() {
          if (attrs.onOpened) {
            attrs.onOpened()
          }
          resolve({ wrapper, $vfm: wrapper.__app._context.provides.$vfm })
        }
      },
      global: {
        plugins: [vfmPlugin],
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
        'onUpdate:modelValue': val => {
          wrapper.setProps({ modelValue: val })
        },
        ...props
      },
      global: {
        plugins: [vfmPlugin],
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
          plugins: [vfmPlugin],
          stubs: { transition: false }
        }
      }
    )
    resolve({ wrapper, $vfm: wrapper.__app._context.provides.$vfm })
  })
}
