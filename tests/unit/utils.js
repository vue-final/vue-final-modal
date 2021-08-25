import { mount } from '@vue/test-utils'
import { createModalInstance } from '../../lib'

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
  const { $vfm, VueFinalModal } = createModalInstance()

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
          resolve({ wrapper, $vfm })
        }
      },
      global: {
        components: {
          VueFinalModal
        },
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
  const { $vfm, VueFinalModal } = createModalInstance()

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
        components: {
          VueFinalModal
        },
        stubs: { transition: false }
      },
      attrs,
      ...mountingOptions
    })
    resolve({ wrapper, $vfm })
  })
}

export function initDynamicModal() {
  const { $vfm, VueFinalModal, ModalsContainer, useModal } = createModalInstance()

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
          components: {
            VueFinalModal,
            ModalsContainer
          },
          stubs: { transition: false }
        }
      }
    )
    resolve({ wrapper, $vfm, useModal })
  })
}
