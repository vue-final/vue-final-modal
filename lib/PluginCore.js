import VueFinalModal from './VueFinalModal.vue'
import { setStyle, removeStyle } from './utils/dom.js'

function createVfm(options) {
  let vfm

  return function() {
    vfm = {
      isScrollLocked: false,
      get openedModals() {
        return this.modals.filter(modal => modal.props.modelValue)
      },
      modals: [],
      show(name) {
        this.toggle(name, true)
      },
      hide(name) {
        this.toggle(name, false)
      },
      hideAll() {
        this.openedModals.forEach(modal => {
          modal.emit('update:modelValue', false)
        })
      },
      toggle(name, show) {
        const modal = this.modals.find(modal => modal.props.name === name)
        if (modal !== undefined) {
          modal.emit('update:modelValue', show === undefined ? !modal.props.modelValue : show)
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

export function bindPrototype(app, options) {
  const vfm = createVfm(options)()
  Object.defineProperty(app.config.globalProperties, options.key, {
    get() {
      return vfm
    }
  })
  app.provide(options.key, vfm)
}

export function registComponent(app, options) {
  app.component(options.componentName, {
    ...VueFinalModal,
    props: { ...VueFinalModal.props, options: { type: Object, default: () => options } }
  })
}
