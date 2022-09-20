import { markRaw, reactive } from 'vue'
import { dynamicModals } from './api'
import VueFinalModal from './components/VueFinalModal.vue'
import type { UseModalOptions } from './Modal'

function existModal(options: UseModalOptions) {
  return dynamicModals.includes(options)
}

export function useModal(_options?: UseModalOptions) {
  const options: UseModalOptions = reactive({
    id: Symbol('useModal'),
    modelValue: false,

    component: markRaw(VueFinalModal) as any,
    bind: {},
    slots: {},
    on: {},

    ..._options,
  })

  const show = () => {
    return existModal(options)
      ? Promise.resolve('[Vue Final Modal] modal is already opened')
      : new Promise((resolve, reject) => {
        options.modelValue = true
        options.rejectOpen = reject
        options.resolveOpened = () => {
          resolve('opened')
        }
        dynamicModals.push(options)
      })
  }

  const hide = () => {
    return existModal(options)
      ? new Promise((resolve, reject) => {
        options.modelValue = false
        options.rejectClose = reject
        options.resolveClosed = () => {
          resolve('closed')
        }
      })
      : Promise.resolve('[Vue Final Modal] modal is already closed')
  }

  return { show, hide, options }
}
