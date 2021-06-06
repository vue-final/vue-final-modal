import { createLocalVue, enableAutoDestroy } from '@vue/test-utils'
import { vfmPlugin } from '../../lib'

enableAutoDestroy(afterEach)

describe('Plugin', () => {
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
