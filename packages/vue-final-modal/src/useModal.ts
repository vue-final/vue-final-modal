import type { Ref } from 'vue'
import { ref, watch } from 'vue'
import type CoreModal from './components/CoreModal/CoreModal.vue'

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

export function useToClose(
  props: InstanceType<typeof CoreModal>['$props'],
  emit: InstanceType<typeof CoreModal>['$emit'],
  options: {
    vfmRootEl: Ref<HTMLDivElement | undefined>
    visible: Ref<boolean>
    modelValueLocal: Ref<boolean>
  }) {
  const { vfmRootEl, visible, modelValueLocal } = options
  const lastMousedownEl = ref<EventTarget | null>()

  function onEsc() {
    if (visible.value && props.escToClose)
      (modelValueLocal.value = false)
  }

  function onMousedown(e?: MouseEvent) {
    lastMousedownEl.value = e?.target
  }

  function onMouseupRoot(): void {
    // skip when the lastMousedownEl didn't equal vfmRootEl
    if (lastMousedownEl.value !== vfmRootEl.value)
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
