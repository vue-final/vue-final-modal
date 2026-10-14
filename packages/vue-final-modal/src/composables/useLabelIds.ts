import type { Ref } from 'vue'
import { computed, onMounted, onUpdated, ref, useId } from 'vue'

/**
 * Ids for the title and the description of a dialog, passed to its default slot.
 * Each one names the dialog only once an element with it is rendered inside, so the dialog never points at a missing element.
 */
export function useLabelIds(dialogEl: Ref<HTMLElement | undefined>) {
  const titleId = useId()
  const descriptionId = useId()
  const hasTitle = ref(false)
  const hasDescription = ref(false)

  function sync() {
    hasTitle.value = !!dialogEl.value?.querySelector(`[id="${titleId}"]`)
    hasDescription.value = !!dialogEl.value?.querySelector(`[id="${descriptionId}"]`)
  }

  onMounted(sync)
  onUpdated(sync)

  return {
    titleId,
    descriptionId,
    labelledby: computed(() => hasTitle.value ? titleId : undefined),
    describedby: computed(() => hasDescription.value ? descriptionId : undefined),
  }
}
