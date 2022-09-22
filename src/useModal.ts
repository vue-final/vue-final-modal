import type { Ref } from 'vue'
import { markRaw, reactive, ref, watch } from 'vue'
import { dynamicModals } from './api'
import VueFinalModal from './components/VueFinalModal.vue'
import type { ComponentProps, UseModal } from './Modal'

function existModal<ModalProps extends ComponentProps, DefaultSlotProps extends ComponentProps>(options: UseModal<ModalProps, DefaultSlotProps>) {
  return dynamicModals.includes(options)
}

export function useModal<ModalProps extends ComponentProps, DefaultSlotProps extends ComponentProps>(_options?: UseModal<ModalProps, DefaultSlotProps>) {
  const options: UseModal<{}, {}> = reactive({
    id: Symbol('useModal'),
    modelValue: false,
    component: markRaw(VueFinalModal),
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

  return {
    open,
    close,
    options,
  }
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
