import { ref } from 'vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import type CoreModal from './CoreModal.vue'

export function useZIndex(
  props: ComponentProps<typeof CoreModal>,
) {
  const zIndex = ref<undefined | number>()

  function refreshZIndex(index: number) {
    zIndex.value = props.zIndexFn?.({ index: index <= -1 ? 0 : index })
  }

  function resetZIndex() {
    zIndex.value = undefined
  }

  return {
    zIndex,
    refreshZIndex,
    resetZIndex,
  }
}
