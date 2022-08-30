import { markRaw, reactive } from 'vue'
import { dynamicModals } from './api'
import VueFinalModal from './components/VueFinalModal.vue'
import type { UseModalOptions } from './Modal'

function existModal(options: UseModalOptions) {
  return dynamicModals.includes(options)
}

export function useModal(_options: UseModalOptions) {
  const options: UseModalOptions = reactive({
    value: false,
    component: markRaw(VueFinalModal) as any,
    id: Symbol('useModal'),
    bind: {},
    slots: {},
    on: {},
  })

  const show = () => {
    return existModal(options)
      ? Promise.resolve('[Vue Final Modal] modal is already opened')
      : new Promise((resolve, reject) => {
        options.value = true
        options.reject = reject
        options.opened = () => {
          resolve('show')
        }
        dynamicModals.push(options)
      })
  }

  const hide = () => {
    return existModal(options)
      ? new Promise((resolve, reject) => {
        options.value = false
        options.rejectClose = reject
        options.closed = () => {
          resolve('hide')
        }
      })
      : Promise.resolve('[Vue Final Modal] modal is already closed')
  }

  return { show, hide, options }
}
