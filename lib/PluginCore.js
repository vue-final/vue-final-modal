import { setStyle, removeStyle } from './utils/dom.js'
import { findRight } from './utils/array'
import VueFinalModal from './VueFinalModal.vue'
import ModalsContainer from './ModalsContainer.vue'

function assignOptions(component, options) {
  const _component = { ...component }
  Object.assign(_component.props, {
    $_options: { type: Object, default: () => options }
  })
  return _component
}

function createVfm(Vue, options) {
  let vfm
  const PREFIX = '_dynamic_modal_'
  const generateId = ((index = 0) => () => (index++).toString())()

  return function() {
    vfm = {
      show(modal, ...args) {
        switch (typeof modal) {
          case 'string':
            this.toggle(modal, true, ...args)
            break
          case 'object':
            {
              const defaultModal = {
                component: options.componentName,
                bind: {},
                slots: {},
                on: {}
              }
              modal = Object.assign(defaultModal, modal)
              const id = generateId()
              const name = modal.bind.name || PREFIX + id
              this.dynamicModals.push({
                value: true,
                id,
                ...modal,
                component: modal.component,
                slots: modal.slots,
                bind: { ...modal.bind, name },
                params: args[0]
              })
            }
            break
        }
      },
      hide(name) {
        this.toggle(name, false)
      },
      hideAll() {
        for (let i = this.openedModals.length - 1; i >= 0; i--) {
          this.openedModals[i].$emit('input', false)
        }
      },
      toggle(name, ...args) {
        const modal = this.get(name)
        if (modal !== undefined) {
          modal.toggle(...args)
        }
      },
      isScrollLocked: false,
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
      },
      get(name) {
        return findRight(this.modals, modal => modal.name === name)
      },
      dynamicModals: [],
      get openedModals() {
        return this.modals.filter(modal => modal.value)
      },
      modals: []
    }
    return Vue.observable(vfm)
  }
}

export function bindPrototype(Vue, options) {
  const vfm = createVfm(Vue, options)()
  Object.defineProperty(Vue.prototype, options.key, {
    get() {
      return vfm
    }
  })
}

export function registModal(Vue, options) {
  Vue.component(options.componentName, assignOptions(VueFinalModal, options))
}
export function registContainer(Vue, options) {
  Vue.component(options.dynamicContainerName, assignOptions(ModalsContainer, options))
}
