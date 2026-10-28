import type { Ref } from 'vue'
import { computed, nextTick, onMounted, onUpdated, ref, useId, warn } from 'vue'

/**
 * Ids for the title and the description of a dialog, passed to its default slot.
 * Each one names the dialog only once an element with it is rendered inside, so the dialog never points at a missing element.
 */
export function useLabelIds(dialogEl: Ref<HTMLElement | undefined>, component: string) {
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

  let warned = false
  /** Once per modal, after it opened and rendered its links: an unnamed dialog is announced as just "dialog". */
  function warnIfUnnamed() {
    nextTick(() => {
      const el = dialogEl.value
      if (warned || !el)
        return
      const root = el.getRootNode() as Document | ShadowRoot
      const resolves = (attr: string) => !!el.getAttribute(attr)?.split(/\s+/).some(id => id && root.getElementById(id))
      if (!el.getAttribute('aria-label')?.trim() && !resolves('aria-labelledby')) {
        warned = true
        warn(`[Vue Final Modal]: <${component}> has no accessible name, so screen readers announce it as just a dialog. Render its title with the titleId slot prop, or pass aria-labelledby or aria-label.`)
      }
      if (el.getAttribute('role') === 'alertdialog' && !resolves('aria-describedby')) {
        warned = true
        warn(`[Vue Final Modal]: <${component}> with role="alertdialog" has no description. Render its message with the descriptionId slot prop, or pass aria-describedby.`)
      }
    })
  }

  return {
    titleId,
    descriptionId,
    labelledby: computed(() => hasTitle.value ? titleId : undefined),
    describedby: computed(() => hasDescription.value ? descriptionId : undefined),
    warnIfUnnamed,
  }
}
