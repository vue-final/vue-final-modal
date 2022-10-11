import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { VueFinalModal } from '../src/index'
import CoreModal from '~/components/CoreModal/CoreModal.vue'

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

describe('tests', () => {
  it('should works', async () => {
    const wrapper = mount(VueFinalModal, {
      props: {
        focusTrap: { disabled: true },
      },
      slots: { default: 'Hello VFM!!' },
    })
    const CoreModalWrapper = wrapper.findComponent(CoreModal)
    expect(CoreModalWrapper.find('.vfm').isVisible()).toBe(false)
    expect(CoreModalWrapper.find('.vfm__overlay').exists()).toBe(false)
    wrapper.setProps({ modelValue: true })
    await afterTransition()
    expect(CoreModalWrapper.find('.vfm').isVisible()).toBe(true)
    expect(CoreModalWrapper.find('.vfm__overlay').isVisible()).toBe(true)
  })
  it('should works 2', async () => {
    const wrapper = mount(VueFinalModal, {
      props: {
        teleportTo: null,
        focusTrap: { disabled: true },
      },
      slots: { default: 'Hello VFM!!' },
    })
    expect(wrapper.find('.vfm').isVisible()).toBe(false)
    expect(wrapper.find('.vfm__overlay').exists()).toBe(false)
    wrapper.setProps({ modelValue: true })
    await afterTransition()
    expect(wrapper.find('.vfm').isVisible()).toBe(true)
    expect(wrapper.find('.vfm__overlay').isVisible()).toBe(true)
  })
})
