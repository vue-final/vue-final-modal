import { mount } from '@vue/test-utils'
import VueFinalModal, { vfmPlugin } from '../../lib'

describe('Plugin', () => {
  it('globally register vue-final-modal', () => {
    const wrapper = mount(
      { template: '<div></div>' },
      {
        global: {
          plugins: [VueFinalModal()]
        }
      }
    )
    expect(wrapper.__app._context.components).toHaveProperty('VueFinalModal')
    expect(wrapper.__app._context.components).toHaveProperty('ModalsContainer')
    expect(wrapper.__app._context.provides).toHaveProperty('$vfm')
  })
  it('globally register vue-final-modal with vfmPlugin', () => {
    const wrapper = mount(
      { template: '<div></div>' },
      {
        global: {
          plugins: [vfmPlugin]
        }
      }
    )
    expect(wrapper.__app._context.components).toHaveProperty('VueFinalModal')
    expect(wrapper.__app._context.components).toHaveProperty('ModalsContainer')
    expect(wrapper.__app._context.provides).toHaveProperty('$vfm')
  })
  it('globally register vue-final-modal by customized options', () => {
    const wrapper = mount(
      { template: '<div></div>' },
      {
        global: {
          plugins: [
            VueFinalModal({
              key: '_$vfm',
              componentName: 'MyModal',
              dynamicContainerName: 'MyModalsContainer'
            })
          ]
        }
      }
    )
    expect(wrapper.__app._context.components).toHaveProperty('MyModal')
    expect(wrapper.__app._context.components).toHaveProperty('MyModalsContainer')
    expect(wrapper.__app._context.provides).toHaveProperty('_$vfm')
  })
  it('globally register vue-final-modal by customized options with vfmPlugin', () => {
    const wrapper = mount(
      { template: '<div></div>' },
      {
        global: {
          plugins: [
            vfmPlugin({
              key: '_$vfm',
              componentName: 'MyModal',
              dynamicContainerName: 'MyModalsContainer'
            })
          ]
        }
      }
    )
    expect(wrapper.__app._context.components).toHaveProperty('MyModal')
    expect(wrapper.__app._context.components).toHaveProperty('MyModalsContainer')
    expect(wrapper.__app._context.provides).toHaveProperty('_$vfm')
  })
})
