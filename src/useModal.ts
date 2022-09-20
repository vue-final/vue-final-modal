import type { Ref } from 'vue'
import { computed, markRaw, reactive, ref, watch } from 'vue'
import { dynamicModals, modals } from './api'
import VueFinalModal from './components/VueFinalModal.vue'
import type { Modal, UseModalOptions } from './Modal'
import { noop, once } from './utils'

function existModal(options: UseModalOptions) {
  return dynamicModals.includes(options)
}

export function useModal(_options?: UseModalOptions) {
  const options: UseModalOptions = reactive({
    id: Symbol('useModal'),
    modelValue: false,
    component: markRaw(VueFinalModal) as any,
    bind: {},
    on: {},
    ..._options,
  })

  const show = () => {
    return existModal(options)
      ? Promise.resolve('[Vue Final Modal] modal is already opened')
      : new Promise((resolve, reject) => {
        options.modelValue = true
        options.rejectOpen = reject
        options.resolveOpened = () => resolve('opened')
        dynamicModals.push(options)
      })
  }

  const hide = () => {
    return existModal(options)
      ? new Promise((resolve, reject) => {
        options.modelValue = false
        options.rejectClose = reject
        options.resolveClosed = () => resolve('closed')
      })
      : Promise.resolve('[Vue Final Modal] modal is already closed')
  }

  return { show, hide, options }
}

export function useModelValue(props: InstanceType<typeof VueFinalModal>['$props']) {
  const modelValueLocal = ref<boolean>(!!props.modelValue)
  watch(() => props.modelValue, (val) => {
    modelValueLocal.value = !!val
  })

  return {
    modelValueLocal,
  }
}

/** This composable function is used for `vfm.toggle` and `useModal` apis */
export function useToggle(props: InstanceType<typeof VueFinalModal>['$props'], emit: InstanceType<typeof VueFinalModal>['$emit'], options: {
  modelValueLocal: Ref<boolean>
}) {
  const { modelValueLocal } = options
  let resolveToggle: (res: string) => void = noop
  let rejectToggle: (err: string) => void = noop

  const modalInstance = computed<Modal>(() => ({
    props: { name: props.name },
    toggle(show?: boolean): Promise<string> {
      return new Promise((resolve, reject) => {
        resolveToggle = once((res: string) => resolve(res))
        rejectToggle = once((err: string) => reject(err))

        const value = typeof show === 'boolean' ? show : !modelValueLocal.value
        modelValueLocal.value = value
        emit('update:modelValue', value)
      })
    },
  }))

  modals.push(modalInstance)

  return {
    resolveToggle,
    rejectToggle,
    modalInstance,
  }
}
