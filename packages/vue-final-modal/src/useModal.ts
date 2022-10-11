import type { Ref } from 'vue'
import { markRaw, reactive, ref, watch } from 'vue'
import { dynamicModals } from './api'
import CoreModal from './components/CoreModal/CoreModal.vue'
import type { ComponentProps, UseModal, UseModalPrivate } from './Modal'

function existModal<ModalProps extends ComponentProps, DefaultSlotProps extends ComponentProps>(options: UseModalPrivate<ModalProps, DefaultSlotProps>) {
  return dynamicModals.includes(options)
}

interface UseModalReturnType {
  open: () => Promise<unknown>
  close: () => Promise<unknown>
  options: UseModalPrivate<{}, {}>
}

export function useModal<ModalProps extends ComponentProps>(_options?: UseModal<ModalProps, ComponentProps>): UseModalReturnType
export function useModal<ModalProps extends ComponentProps, DefaultSlotProps extends ComponentProps>(_options?: UseModal<ModalProps, DefaultSlotProps>): UseModalReturnType
export function useModal<ModalProps extends ComponentProps, DefaultSlotProps extends ComponentProps>(_options?: UseModal<ModalProps, DefaultSlotProps>): UseModalReturnType {
  const options: UseModalPrivate<{}, {}> = reactive({
    id: Symbol('useModal'),
    modelValue: false,
    component: markRaw(CoreModal),
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

export function useModelValue(props: InstanceType<typeof CoreModal>['$props'], emit: InstanceType<typeof CoreModal>['$emit']): { modelValueLocal: Ref<boolean> } {
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

export function useToClose(props: InstanceType<typeof CoreModal>['$props'], emit: InstanceType<typeof CoreModal>['$emit'], options: {
  vfmRoot: Ref<HTMLDivElement | undefined>
  visible: Ref<boolean>
  modelValueLocal: Ref<boolean>
}) {
  const { vfmRoot, visible, modelValueLocal } = options
  const lastMousedownEl = ref<EventTarget | null>()

  function onEsc() {
    if (visible.value && props.escToClose)
      (modelValueLocal.value = false)
  }

  function onMousedown(e?: MouseEvent) {
    lastMousedownEl.value = e?.target
  }

  function onMouseupRoot(): void {
    // skip when the lastMousedownEl didn't equal vfmRoot
    if (lastMousedownEl.value !== vfmRoot.value)
      return

    if (props.clickToClose)
      modelValueLocal.value = false
    else
      emit('clickOutside')
  }

  return {
    onEsc,
    onMouseupRoot,
    onMousedown,
  }
}
