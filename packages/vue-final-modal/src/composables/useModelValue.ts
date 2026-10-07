import { computed, ref, watch } from 'vue'
import type VueFinalModal from '~/components/VueFinalModal.vue'
import type { ComponentEmit, ComponentProps } from '~/types'

export function useModelValue(
  props: ComponentProps<typeof VueFinalModal>,
  emit: ComponentEmit<typeof VueFinalModal>,
  options: {
    open: () => boolean
    close: () => boolean
  },
) {
  const { open, close } = options
  const value = ref(false)

  /** Only changes when open() or close() went through: one stopped in beforeOpen/beforeClose bounces the previous value back to v-model. */
  const modelValueLocal = computed<boolean>({
    get: () => value.value,
    set(next) {
      if (next === value.value)
        return
      if (next ? open() : close()) {
        value.value = next
        if (next !== props.modelValue)
          emit('update:modelValue', next)
      }
      else {
        emit('update:modelValue', !next)
      }
    },
  })

  watch(() => props.modelValue, (next) => {
    modelValueLocal.value = !!next
  })

  return {
    modelValueLocal,
  }
}
