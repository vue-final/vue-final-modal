import VueFinalModal from './VueFinalModal.vue'

const Plugin = {
  install(app) {
    if (app.config.globalProperties.$vfm) {
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
                modal.emit('update:modelValue', false)
              })
            },
            toggle(name, show) {
              const modal = this.modals.find(modal => modal.name === name)
              if (modal !== undefined) {
                modal.emit('update:modelValue', show)
              }
            }
          }
        }
        return vfm
      }
    })()

    const vfm = createVfm()

    Object.defineProperty(app.config.globalProperties, '$vfm', {
      get() {
        return vfm
      }
    })
    app.provide('$vfm', vfm)

    app.component('VueFinalModal', VueFinalModal)
  }
}

export default Plugin
