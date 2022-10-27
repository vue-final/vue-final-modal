import type { Ref } from 'vue'
import { ref, watch } from 'vue'
import type CoreModal from './CoreModal.vue'

export function useModelValue(
  props: InstanceType<typeof CoreModal>['$props'],
  emit: InstanceType<typeof CoreModal>['$emit'],
): { modelValueLocal: Ref<boolean> } {
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
