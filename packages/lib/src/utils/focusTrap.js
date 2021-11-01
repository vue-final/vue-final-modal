import { watch } from 'vue'
import { TransitionState } from './transitionState'

// stolen from vue-js-modal

const FOCUSABLE_ELEMENTS_QUERY =
  'button:not([disabled]), ' +
  'select:not([disabled]), ' +
  'a[href]:not([disabled]), ' +
  'area[href]:not([disabled]), ' +
  '[contentEditable=""]:not([disabled]), ' +
  '[contentEditable="true"]:not([disabled]), ' +
  '[contentEditable="TRUE"]:not([disabled]), ' +
  'textarea:not([disabled]), ' +
  'iframe:not([disabled]), ' +
  'input:not([disabled]), ' +
  'summary:not([disabled]), ' +
  '[tabindex]:not([tabindex="-1"])'

const isTabPressed = event => {
  return event.key === 'Tab' || event.keyCode === 9
}

const querySelectorAll = (element, selector) => {
  return [...(element.querySelectorAll(selector) || [])]
}

const queryFocusableElements = element => {
  return querySelectorAll(element, FOCUSABLE_ELEMENTS_QUERY)
}

const isFocused = element => {
  return element == document.activeElement
}

const isNothingFocused = () => {
  return !document.activeElement
}

class FocusTrap {
  constructor() {
    this.root = null
    this.elements = []

    this.onKeyDown = this.onKeyDown.bind(this)
  }

  /**
   * Get last Element on the trap
   *
   * @return {HTMLElement | null} element
   */
  get lastElement() {
    return this.elements[this.elements.length - 1] || null
  }

  /**
   * Get first Element on the trap
   *
   * @return {HTMLElement | null} element
   */
  get firstElement() {
    return this.elements[0] || null
  }

  /**
   * Get whether the trap is enabled
   *
   * @return {boolean} isEnabled
   */
  get isEnabled() {
    return !!this.root
  }

  onKeyDown(event) {
    if (!isTabPressed(event)) {
      return
    }

    // SHIFT + TAB
    if (event.shiftKey) {
      if (isFocused(this.firstElement)) {
        this.lastElement.focus()
        event.preventDefault()
      }
      return
    }

    // TAB
    if (isNothingFocused() || isFocused(this.lastElement)) {
      this.firstElement.focus()
      event.preventDefault()
      return
    }
  }

  /**
   * Enable focus trap
   *
   * @param {HTMLElement} root - the focus trap root element
   */
  enable(root) {
    if (!root) {
      return
    }

    this.root = root
    this.elements = queryFocusableElements(this.root)

    this.root.addEventListener('keydown', this.onKeyDown)
  }

  /**
   * Disable focus trap
   */
  disable() {
    this.root.removeEventListener('keydown', this.onKeyDown)
    this.root = null
  }
}

/**
 * @type {FocusTrap | null}
 */
let focusTrap = null

/**
 * Get FocusTrap focusTrap
 *
 * @returns {FocusTrap} focusTrap
 */
export function useFocusTrap({ props, vfmContainer, modalTransitionState }) {
  if (focusTrap == null) {
    focusTrap = new FocusTrap()
  }

  watch(modalTransitionState, state => {
    switch (state) {
      case TransitionState.Enter:
        if (props.focusRetain || props.focusTrap) {
          vfmContainer.value.focus()
        }
        props.focusTrap && focusTrap.enable(vfmContainer.value)
        break
      case TransitionState.Leaving:
        if (focusTrap.enabled) {
          focusTrap.disable()
        }
        break
    }
  })

  return { focusTrap }
}
