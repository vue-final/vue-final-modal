import VueFinalModal from './VueFinalModal.vue'

function createVfm() {
  let vfm

  return function() {
    vfm = {
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
        const modal = this.get(name)
        if (modal !== undefined) {
          modal.toggle(...args)
        }
      },
      get(name) {
        return this.modals.find(modal => modal.name === name)
      },
      openedModals: [],
      modals: []
    }
    return vfm
  }
}

export function bindPrototype(Vue, options) {
  const vfm = createVfm()()
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
