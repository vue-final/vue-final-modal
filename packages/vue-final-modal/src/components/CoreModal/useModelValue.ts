import { nextTick, ref, watch } from 'vue'
import type { Ref } from 'vue'
import type CoreModal from './CoreModal.vue'

export function useModelValue(
  props: InstanceType<typeof CoreModal>['$props'],
  emit: InstanceType<typeof CoreModal>['$emit'],
  options: {
    open: () => boolean
    close: () => boolean
  },
) {
  let skip = false
  const { open, close } = options

  /** The truth of modal open or close */
  const _modelValueLocal = ref<boolean>(false)

  /**
   * The proxy of `_modelValueLocal`
   */
  const modelValueLocal = {
    get value() {
      return _modelValueLocal.value
    },
    set value(val: boolean) {
      setModelValueLocal(val)
    },
  } as Ref<boolean>

  /**
   * Because of the open/close can be stopped in `@beforeOpen`, `@beforeClose` events.
   * So the function is to make sure `_modelValueLocal`, `props.modelValue` are always the same value
   */
  function setModelValueLocal(val: boolean) {
    const success = val ? open() : close()
    if (success) {
      _modelValueLocal.value = val
      if (val !== props.modelValue)
        emit('update:modelValue', val)
    }
    else {
      skip = true
      emit('update:modelValue', !val)
      nextTick(() => {
        skip = false
      })
    }
  }

  watch(() => props.modelValue, (val) => {
    if (skip)
      return
    modelValueLocal.value = !!val
  })

  return {
    modelValueLocal,
  }
}
