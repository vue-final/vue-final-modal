import VueFinalModal from './VueFinalModal.vue'
import { setStyle, removeStyle } from './utils/dom.js'

function createVfm(options) {
  let vfm

  return function() {
    vfm = {
      isScrollLocked: false,
      get openedModals() {
        return this.modals.filter(modal => modal.value)
      },
      modals: [],
      show(name, ...args) {
        this.toggle(name, true, ...args)
      },
      hide(name) {
        this.toggle(name, false)
      },
      hideAll() {
        this.openedModals.forEach(modal => {
          modal.$emit('input', false)
        })
      },
      toggle(name, ...args) {
        const modal = this.modals.find(modal => modal.name === name)
        if (modal !== undefined) {
          modal.toggle(...args)
        }
      },
      lockScroll() {
        if (this.isScrollLocked) return
        if (options.isMobile) {
          setStyle(document.body, 'overflow', 'hidden')
        } else {
          window.addEventListener('wheel', this.lockScrollListener, { passive: false })
        }
        this.isScrollLocked = true
      },
      unlockScroll() {
        if (options.isMobile) {
          removeStyle(document.body, 'overflow')
        } else {
          window.removeEventListener('wheel', this.lockScrollListener)
        }
        this.isScrollLocked = false
      },
      lockScrollListener(e) {
        e.preventDefault()
      }
    }
    return vfm
  }
}

export function bindPrototype(Vue, options) {
  const vfm = createVfm(options)()
  Object.defineProperty(Vue.prototype, options.key, {
    get() {
      return vfm
    }
  })
}

export function registComponent(Vue, options) {
  Vue.component(options.componentName, {
    ...VueFinalModal,
    props: { ...VueFinalModal.props, $_options: { type: Object, default: () => options } }
  })
}
