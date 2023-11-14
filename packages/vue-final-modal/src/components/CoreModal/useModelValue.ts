import { computed, ref, watch } from 'vue'
import type CoreModal from './CoreModal.vue'

export function useModelValue(
  props: InstanceType<typeof CoreModal>['$props'],
  emit: InstanceType<typeof CoreModal>['$emit'],
  options: {
    open: () => boolean
    close: () => boolean
  },
) {
  const { open, close } = options

  /** The truth of modal open or close */
  const _modelValueLocal = ref<boolean>(false)

  /**
   * A WritableComputedRef, a only variable to control open or close the modal
   */
  const modelValueLocal = computed({
    get: () => _modelValueLocal.value,
    set: setModelValueLocal,
  })

  /**
   * Because of the open/close can be stopped in `@beforeOpen`, `@beforeClose` events.
   * So the function is to make sure `_modelValueLocal`, `props.modelValue` are always the same value
   */
  function setModelValueLocal(val: boolean) {
    const success = val ? open() : close()
    if (success)
      _modelValueLocal.value = val
    else
      emit('update:modelValue', !val)
  }

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
