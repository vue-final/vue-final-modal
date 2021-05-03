import { createLocalVue, enableAutoDestroy } from '@vue/test-utils'
import VueFinalModal from '../../lib'
import { DUPLICATE_KEY, DUPLICATE_COMPONENT, DUPLICATE_DYNAMIC_CONTAINER } from '../../lib/utils/errors'

enableAutoDestroy(afterEach)

const createSpyError = () => {
  global.console.error = jest.fn()
  return jest.spyOn(global.console, 'error')
}

describe('Plugin', () => {
  it('duplicate all', () => {
    const spy = createSpyError()
    const localVue = createLocalVue()
    localVue.use(VueFinalModal())
    localVue.use(VueFinalModal())
    expect(spy).toHaveBeenNthCalledWith(1, DUPLICATE_KEY)
    expect(spy).toHaveBeenNthCalledWith(2, DUPLICATE_COMPONENT)
    expect(spy).toHaveBeenNthCalledWith(3, DUPLICATE_DYNAMIC_CONTAINER)
  })
  it('duplicate key only', () => {
    const spy = createSpyError()
    const localVue = createLocalVue()
    localVue.use(VueFinalModal())
    localVue.use(
      VueFinalModal({
        componentName: 'VueFinalTest',
        dynamicContainerName: 'TestContainer'
      })
    )
    expect(spy).toHaveBeenCalledTimes(1)
  })
  it('duplicate component', () => {
    const spy = createSpyError()
    const localVue = createLocalVue()
    localVue.use(VueFinalModal())
    localVue.use(
      VueFinalModal({
        dynamicContainerName: 'TestContainer'
      })
    )
    expect(spy).toHaveBeenNthCalledWith(1, DUPLICATE_KEY)
    expect(spy).toHaveBeenNthCalledWith(2, DUPLICATE_COMPONENT)
  })
  it('duplicate container', () => {
    const spy = createSpyError()
    const localVue = createLocalVue()
    localVue.use(VueFinalModal())
    localVue.use(
      VueFinalModal({
        componentName: 'VueFinalTest'
      })
    )
    expect(spy).toHaveBeenNthCalledWith(1, DUPLICATE_KEY)
    expect(spy).toHaveBeenNthCalledWith(2, DUPLICATE_DYNAMIC_CONTAINER)
  })
  it('different key', () => {
    const spy = createSpyError()
    const localVue = createLocalVue()
    localVue.use(VueFinalModal())
    localVue.use(
      VueFinalModal({
        key: 'vft'
      })
    )
    expect(spy).toHaveBeenNthCalledWith(1, DUPLICATE_COMPONENT)
    expect(spy).toHaveBeenNthCalledWith(2, DUPLICATE_DYNAMIC_CONTAINER)
  })
  it('window is undefined in node server', () => {
    Object.defineProperty(global, 'window', { value: undefined })
    global.console.error = jest.fn()
    const spy = jest.spyOn(global.console, 'error')
    const localVue = createLocalVue()
    localVue.use(VueFinalModal())
    localVue.use(VueFinalModal())
    expect(spy).toHaveBeenCalledTimes(0)
  })
})
