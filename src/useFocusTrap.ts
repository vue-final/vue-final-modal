import type { Ref } from 'vue'
import { nextTick } from 'vue'
import { openedModals } from './api'
import type { VueFinalModal } from '.'

// stolen from vue-js-modal

const FOCUSABLE_ELEMENTS_QUERY
  = 'button:not([disabled]), '
  + 'select:not([disabled]), '
  + 'a[href]:not([disabled]), '
  + 'area[href]:not([disabled]), '
  + '[contentEditable=""]:not([disabled]), '
  + '[contentEditable="true"]:not([disabled]), '
  + '[contentEditable="TRUE"]:not([disabled]), '
  + 'textarea:not([disabled]), '
  + 'iframe:not([disabled]), '
  + 'input:not([disabled]), '
  + 'summary:not([disabled]), '
  + '[tabindex]:not([tabindex="-1"])'

const isTabPressed = (event: KeyboardEvent) => {
  return event.key === 'Tab' || event.keyCode === 9
}

const querySelectorAll = (element: HTMLElement, selector: string) => {
  return [...(Array.from(element.querySelectorAll(selector)) || [])] as HTMLElement[]
}

const queryFocusableElements = (element: HTMLElement) => {
  return querySelectorAll(element, FOCUSABLE_ELEMENTS_QUERY)
}

const isFocused = (element?: HTMLElement) => {
  return element === document.activeElement
}

const isNothingFocused = () => {
  return !document.activeElement
}

class FocusTrap {
  root: HTMLElement | null
  elements: (HTMLElement | null)[]

  constructor() {
    this.root = null
    this.elements = []

    this.onKeyDown = this.onKeyDown.bind(this)
  }

  // Get last Element on the trap
  get lastElement() {
    return this.elements[this.elements.length - 1] || undefined
  }

  // Get first HTMLElement on the trap
  get firstElement() {
    return this.elements[0] || undefined
  }

  // Get whether the trap is enabled
  get isEnabled() {
    return !!this.root
  }

  onKeyDown(event: KeyboardEvent) {
    if (!isTabPressed(event))
      return

    // SHIFT + TAB
    if (event.shiftKey) {
      if (isFocused(this.firstElement)) {
        this.lastElement?.focus?.()
        event.preventDefault()
      }
      return
    }

    // TAB
    if (isNothingFocused() || isFocused(this.lastElement)) {
      this.firstElement?.focus?.()
      event.preventDefault()
    }
  }

  enable(root?: HTMLElement) {
    if (!root)
      return

    this.root = root
    this.elements = queryFocusableElements(this.root)

    this.root.addEventListener('keydown', this.onKeyDown)
  }

  disable() {
    this.root?.removeEventListener('keydown', this.onKeyDown)
    this.root = null
  }
}

let focusTrap: FocusTrap | null = null

export function useFocusTrap(props: InstanceType<typeof VueFinalModal>['$props'], options: {
  focusEl: Ref<undefined | HTMLDivElement>
}) {
  if (focusTrap == null)
    focusTrap = new FocusTrap()
  const { focusEl } = options

  function focus() {
    if (props.autoFocus || props.focusTrap)
      focusEl.value?.focus()

    props.focusTrap && focusTrap?.enable(focusEl.value)
  }

  async function focusLast() {
    // If there are still nested modals opened, focus the last opened modal
    if (openedModals.length <= 0)
      return
    await nextTick()
    const modal = openedModals[openedModals.length - 1]
    modal.value.focus()
  }

  function blur() {
    if (focusTrap?.isEnabled)
      focusTrap.disable()
  }

  return { focus, focusLast, blur }
}
