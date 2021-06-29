import { createLocalVue, enableAutoDestroy } from '@vue/test-utils'
import VueFinalModal, { vfmPlugin } from '../../lib'

enableAutoDestroy(afterEach)

describe('Plugin', () => {
  it('globally register vue-final-modal', () => {
    const localVue = createLocalVue()
    localVue.use(VueFinalModal())
    expect(localVue.options.components).toHaveProperty('VueFinalModal')
    expect(localVue.options.components).toHaveProperty('ModalsContainer')
    expect(localVue.prototype).toHaveProperty('$vfm')
  })
  it('globally register vue-final-modal by customized options', () => {
    const localVue = createLocalVue()
    localVue.use(
      VueFinalModal({
        key: '_$vfm',
        componentName: 'MyModal',
        dynamicContainerName: 'MyModalsContainer'
      })
    )
    expect(localVue.options.components).toHaveProperty('MyModal')
    expect(localVue.options.components).toHaveProperty('MyModalsContainer')
    expect(localVue.prototype).toHaveProperty('_$vfm')
  })
  it('window is undefined in node server', () => {
    Object.defineProperty(global, 'window', { value: undefined })
    global.console.error = jest.fn()
    const spy = jest.spyOn(global.console, 'error')
    const localVue = createLocalVue()
    localVue.use(vfmPlugin)
    localVue.use(vfmPlugin)
    expect(spy).toHaveBeenCalledTimes(0)
  })
})
