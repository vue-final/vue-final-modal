import type { Directive } from 'vue'

interface VVisibleElement extends HTMLElement {
  // _vov = vue original visibility
  _vov: string
}

export const vVisible: Directive = {
  beforeMount(el, { value }, { transition }) {
    el._vov = el.style.visibility === 'hidden' ? '' : el.style.visibility
    if (transition && value)
      transition.beforeEnter(el)
    else
      setVisibility(el, value)
  },
  mounted(el, { value }, { transition }) {
    if (transition && value)
      transition.enter(el)
  },
  updated(el, { value, oldValue }, { transition }) {
    if (!value === !oldValue)
      return
    if (transition) {
      if (value) {
        transition.beforeEnter(el)
        setVisibility(el, true)
        transition.enter(el)
      }
      else {
        transition.leave(el, () => {
          setVisibility(el, false)
        })
      }
    }
    else {
      setVisibility(el, value)
    }
  },
  beforeUnmount(el, { value }) {
    setVisibility(el, value)
  },
}

function setVisibility(el: VVisibleElement, value: unknown): void {
  el.style.visibility = value ? el._vov : 'hidden'
}
