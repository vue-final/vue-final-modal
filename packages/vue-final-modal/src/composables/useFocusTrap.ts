import type { Ref } from 'vue'
import type VueFinalModal from '~/components/VueFinalModal.vue'
import type { ComponentProps } from '~/types'
import { useFocusTrap as _useFocusTrap } from '@vueuse/integrations/useFocusTrap'

/** The element each modal root opened from, so the focus can go back along the modals that opened each other. */
const openers = new WeakMap<Element, Element>()

/** An element of a modal that has closed since is gone: go back to where that modal opened from instead. */
function returnTarget(el: Element | undefined): HTMLElement | SVGElement | false {
  while (el && !el.isConnected) {
    const modal = el.closest('.vfm')
    el = modal ? openers.get(modal) : undefined
  }
  return el instanceof HTMLElement || el instanceof SVGElement ? el : false
}

/**
 * What a click opening a modal pressed: until the modal's trap activates a frame later, the trap of the modal below
 * still holds the focus and pulls it back out of a modal opened just before.
 */
let pressed: Element | null = null
let tracking = false

function trackPresses() {
  if (tracking)
    return
  tracking = true
  document.addEventListener('pointerdown', (e) => {
    pressed = e.target instanceof Element ? e.target.closest('button, a[href], input, select, textarea, summary, [tabindex], [contenteditable]') : null
  }, true)
  document.addEventListener('click', () => setTimeout(() => {
    pressed = null
  }), true)
  document.addEventListener('keydown', () => {
    pressed = null
  }, true)
}

export function useFocusTrap(
  props: ComponentProps<typeof VueFinalModal>,
  options: {
    focusEl: Ref<undefined | HTMLDivElement>
  },
) {
  if (props.focusTrap === false) {
    return {
      focus() {},
      blur() {},
    }
  }

  const { focusEl } = options
  /** Outside clicks must still reach clickToClose and an interactive background. */
  const allowOutsideClick = true
  /** Esc belongs to escToClose: focus-trap's own Esc handler runs on document after ours, so the modal underneath, just unpaused by that keydown, would deactivate too. */
  const escapeDeactivates = false
  /** focus-trap falls back to this when an initialFocus selector matches nothing, and throws without it. */
  const fallbackFocus = () => focusEl.value?.querySelector<HTMLElement>(':scope > .vfm__content') ?? focusEl.value as HTMLDivElement
  /** Read when the modal opens rather than when the trap activates a frame later, by when a click may have moved the focus on. */
  const setReturnFocus = (previous: HTMLElement | SVGElement) => returnTarget(focusEl.value && openers.get(focusEl.value)) || previous
  const { hasFocus, activate, deactivate } = _useFocusTrap(focusEl, { allowOutsideClick, escapeDeactivates, fallbackFocus, setReturnFocus, ...props.focusTrap })
  let pendingFrame: number | undefined

  function cancelPendingFocus() {
    if (pendingFrame === undefined)
      return
    cancelAnimationFrame(pendingFrame)
    pendingFrame = undefined
  }

  function focus() {
    trackPresses()
    const opener = pressed?.isConnected ? pressed : document.activeElement
    if (focusEl.value && opener)
      openers.set(focusEl.value, opener)
    cancelPendingFocus()
    pendingFrame = requestAnimationFrame(() => {
      pendingFrame = undefined
      activate()
    })
  }

  function blur() {
    /** A trap activated after close() would pause the parent modal's trap and lose focus once this modal's element is removed. */
    cancelPendingFocus()
    if (hasFocus.value)
      deactivate()
  }

  return { focus, blur }
}
