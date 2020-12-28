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
          modal.emit('update:modelValue', false)
        })
      },
      toggle(name, ...args) {
        const modal = this.get(name)
        if (modal !== undefined) {
          modal.toggle(...args)
        }
      },
      get(name) {
        return this.modals.find(modal => modal.props.name === name)
      },
      openedModals: [],
      modals: []
    }
    return vfm
  }
}

export function bindPrototype(app, options) {
  const vfm = createVfm()()
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
