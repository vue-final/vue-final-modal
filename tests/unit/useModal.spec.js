import { initDynamicModal } from './utils'

describe('useModal', () => {
  it('open modal with useModal', async () => {
    const { wrapper, useModal } = await initDynamicModal()
    const string = 'testUseModal'
    const modal = useModal({
      slots: {
        default: string
      }
    })

    await modal.show()
    expect(wrapper.find('.vfm').html()).toContain(string)
    
    const showResponse = await modal.show()
    expect(showResponse).toEqual('[Vue Final Modal] modal is already opened')

    await modal.hide()
    expect(wrapper.find('.vfm').exists()).toBe(false)
    
    const hideResponse = await modal.hide()
    expect(hideResponse).toEqual('[Vue Final Modal] modal is already closed')

    wrapper.unmount()
  })
})
