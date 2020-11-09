import VueFinalModal from './VueFinalModal.vue'

function createVfm() {
  let vfm

  return function() {
    vfm = {
      openedModals: [],
      modals: [],
      show(name) {
        this.toggle(name, true)
      },
      hide(name) {
        this.toggle(name, false)
      },
      hideAll() {
        this.openedModals.forEach(modal => {
          modal.$emit('input', false)
        })
      },
      toggle(name, show) {
        const modal = this.modals.find(modal => modal.name === name)
        if (modal !== undefined) {
          modal.$emit('input', show === undefined ? !modal.value : show)
        }
      }
    }
    return vfm
  }
}

export function bindPrototype(Vue, { key }) {
  const vfm = createVfm()()
  Object.defineProperty(Vue.prototype, key, {
    get() {
      return vfm
    }
  })
}

export function registComponent(Vue, { componentName, key }) {
  Vue.component(componentName, {
    ...VueFinalModal,
    props: { ...VueFinalModal.props, $_key: { type: String, default: key } }
  })
}
