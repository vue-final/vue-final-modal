import { describe, expect, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { CoreModal, VueFinalModal, createVfm } from '../src/index'

// vi.mock('tabbable', async () => {
//   const lib = await vi.importActual<typeof import('tabbable')>('tabbable')
//   return {
//     ...lib,
//     tabbable: (node: any, options: any) => lib.tabbable(node, { ...options, displayCheck: 'none' }),
//     focusable: (node: any, options: any) => lib.focusable(node, { ...options, displayCheck: 'none' }),
//     isFocusable: (node: any, options: any) => lib.isFocusable(node, { ...options, displayCheck: 'none' }),
//     isTabbable: (node: any, options: any) => lib.isTabbable(node, { ...options, displayCheck: 'none' }),
//   }
// })

function afterTransition(transitionDelay = 0): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, transitionDelay)
  })
}

function expectVisible(coreWrapper: VueWrapper<InstanceType<typeof CoreModal | typeof VueFinalModal>>, selector: string, value: boolean) {
  expect(coreWrapper.find(selector).isVisible()).toBe(value)
}
function expectExist(coreWrapper: VueWrapper<InstanceType<typeof CoreModal | typeof VueFinalModal>>, selector: string, value: boolean) {
  expect(coreWrapper.find(selector).exists()).toBe(value)
}

describe('tests VueFinalModal', () => {
  it('basic', async () => {
    const wrapper = mount(VueFinalModal, {
      props: {
        focusTrap: false,
      },
      global: {
        plugins: [createVfm()],
      },
    })
    const CoreModalWrapper = wrapper.findComponent(CoreModal)
    expectExist(CoreModalWrapper, '.vfm', false)
    expectExist(CoreModalWrapper, '.vfm__overlay', false)
    wrapper.setProps({ modelValue: true })
    await afterTransition()
    expectVisible(CoreModalWrapper, '.vfm', true)
    expectVisible(CoreModalWrapper, '.vfm__overlay', true)
  })

  it('ssr', async () => {
    const wrapper = mount(VueFinalModal, {
      props: {
        displayDirective: 'show',
        focusTrap: false,
      },
      global: {
        plugins: [createVfm()],
      },
    })
    const CoreModalWrapper = wrapper.findComponent(CoreModal)
    expectVisible(CoreModalWrapper, '.vfm', false)
    expectExist(CoreModalWrapper, '.vfm__overlay', false)
    wrapper.setProps({ modelValue: true })
    await afterTransition()
    expectVisible(CoreModalWrapper, '.vfm', true)
    expectVisible(CoreModalWrapper, '.vfm__overlay', true)
  })
})
