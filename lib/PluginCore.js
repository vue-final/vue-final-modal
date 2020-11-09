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

export function bindPrototype(Vue, { cmd }) {
  const vfm = createVfm()()
  Object.defineProperty(Vue.prototype, cmd, {
    get() {
      return vfm
    }
  })
}

export function registComponent(Vue, { name, cmd }) {
  Vue.component(name, {
    ...VueFinalModal,
    props: { ...VueFinalModal.props, cmd: { type: String, default: cmd } }
  })
}
