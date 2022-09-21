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

  const open = () => {
    return existModal(options)
      ? Promise.resolve('[Vue Final Modal] modal is already opened')
      : new Promise((resolve, reject) => {
        options.modelValue = true
        options.rejectOpen = reject
        options.resolveOpened = () => resolve('opened')
        dynamicModals.push(options)
      })
  }

  const close = () => {
    return existModal(options)
      ? new Promise((resolve, reject) => {
        options.modelValue = false
        options.rejectClose = reject
        options.resolveClosed = () => resolve('closed')
      })
      : Promise.resolve('[Vue Final Modal] modal is already closed')
  }

  return { open, close, options }
}

export function useModelValue(props: InstanceType<typeof VueFinalModal>['$props'], emit: InstanceType<typeof VueFinalModal>['$emit']): { modelValueLocal: Ref<boolean> } {
  const modelValueLocal = ref<boolean>(!!props.modelValue)
  watch(() => props.modelValue, (val) => {
    modelValueLocal.value = !!val
  })
  watch(modelValueLocal, (val) => {
    if (val !== props.modelValue)
      emit('update:modelValue', val)
  })

  return {
    modelValueLocal,
  }
}

/** This composable function is used for `vfm.toggle` and `useModal` apis */
export function useToggle(props: InstanceType<typeof VueFinalModal>['$props'], options: {
  focus: () => void
  modelValueLocal: Ref<boolean>
}) {
  const { focus, modelValueLocal } = options
  const resolveToggle = ref<(res: string) => void>(noop)
  const rejectToggle = ref<(err: string) => void>(noop)

  const modalInstance = computed<Modal>(() => ({
    name: props.name,
    focus,
    toggle(show?: boolean): Promise<string> {
      return new Promise((resolve, reject) => {
        resolveToggle.value = once((res: string) => resolve(res))
        rejectToggle.value = once((err: string) => {
          reject(new Error(`[Vue Final Modal] Error: reject the toggle event: ${err}`))
        })

        const value = typeof show === 'boolean' ? show : !modelValueLocal.value
        modelValueLocal.value = value
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

export function useToClose(props: InstanceType<typeof VueFinalModal>['$props'], emit: InstanceType<typeof VueFinalModal>['$emit'], options: {
  vfmContainer: Ref<HTMLDivElement | undefined>
  visible: Ref<boolean>
  modelValueLocal: Ref<boolean>
}) {
  const { vfmContainer, visible, modelValueLocal } = options
  const lastMousedownEl = ref<EventTarget | null>()

  function onEsc() {
    if (visible.value && props.escToClose)
      (modelValueLocal.value = false)
  }

  function onMousedown(e?: MouseEvent) {
    lastMousedownEl.value = e?.target
  }

  function onMouseupContainer(): void {
  // skip when the lastMousedownEl didn't equal vfmContainer
    if (lastMousedownEl.value !== vfmContainer.value)
      return
    // TODO
    // skip when state equal 'resize:move'
    // if (state.value === 'resize:move')
    //   return
    emit('clickOutside')
    props.clickToClose && (modelValueLocal.value = false)
  }

  return {
    onEsc,
    onMouseupContainer,
    onMousedown,
  }
}
