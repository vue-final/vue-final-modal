import { mount } from '@vue/test-utils'
import VueFinalModal from '../../lib'
import { DUPLICATE_KEY, DUPLICATE_COMPONENT, DUPLICATE_DYNAMIC_CONTAINER } from '../../lib/utils/errors'

const createSpyError = () => {
  global.console.error = jest.fn()
  return jest.spyOn(global.console, 'error')
}

describe('Plugin', () => {
  it('duplicate all', () => {
    const spy = createSpyError()
    const wrapper = mount(
      { template: '<div></div>' },
      {
        global: {
          plugins: [VueFinalModal(), VueFinalModal()]
        }
      }
    )
    expect(spy).toHaveBeenNthCalledWith(1, DUPLICATE_KEY)
    expect(spy).toHaveBeenNthCalledWith(2, DUPLICATE_COMPONENT)
    expect(spy).toHaveBeenNthCalledWith(3, DUPLICATE_DYNAMIC_CONTAINER)
    wrapper.unmount()
  })
  it('duplicate key only', () => {
    const spy = createSpyError()
    const wrapper = mount(
      { template: '<div></div>' },
      {
        global: {
          plugins: [
            VueFinalModal(),
            VueFinalModal({
              componentName: 'VueFinalTest',
              dynamicContainerName: 'TestContainer'
            })
          ]
        }
      }
    )
    expect(spy).toHaveBeenCalledTimes(1)
    wrapper.unmount()
  })
  it('duplicate component', () => {
    const spy = createSpyError()
    const wrapper = mount(
      { template: '<div></div>' },
      {
        global: {
          plugins: [
            VueFinalModal(),
            VueFinalModal({
              dynamicContainerName: 'TestContainer'
            })
          ]
        }
      }
    )
    expect(spy).toHaveBeenNthCalledWith(1, DUPLICATE_KEY)
    expect(spy).toHaveBeenNthCalledWith(2, DUPLICATE_COMPONENT)
    wrapper.unmount()
  })
  it('duplicate container', () => {
    const spy = createSpyError()
    const wrapper = mount(
      { template: '<div></div>' },
      {
        global: {
          plugins: [
            VueFinalModal(),
            VueFinalModal({
              componentName: 'VueFinalTest'
            })
          ]
        }
      }
    )
    expect(spy).toHaveBeenNthCalledWith(1, DUPLICATE_KEY)
    expect(spy).toHaveBeenNthCalledWith(2, DUPLICATE_DYNAMIC_CONTAINER)
    wrapper.unmount()
  })
  it('different key', () => {
    const spy = createSpyError()
    const wrapper = mount(
      { template: '<div></div>' },
      {
        global: {
          plugins: [
            VueFinalModal(),
            VueFinalModal({
              key: 'vft'
            })
          ]
        }
      }
    )
    expect(spy).toHaveBeenNthCalledWith(1, DUPLICATE_COMPONENT)
    expect(spy).toHaveBeenNthCalledWith(2, DUPLICATE_DYNAMIC_CONTAINER)
    wrapper.unmount()
  })
})
