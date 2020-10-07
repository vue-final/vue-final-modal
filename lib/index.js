import VueFinalModal from './VueFinalModal.vue'

const Plugin = {
  install(Vue) {
    if (Vue.prototype.$vfm) {
      return
    }
    const createVfm = (function() {
      let vfm

      return function() {
        if (!vfm) {
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
                modal.$emit('input', show)
              }
            }
          }
        }
        return vfm
      }
    })()

    const vfm = createVfm()

    Object.defineProperty(Vue.prototype, '$vfm', {
      get() {
        return vfm
      }
    })

    Vue.component('VueFinalModal', VueFinalModal)
  }
}

export default Plugin
