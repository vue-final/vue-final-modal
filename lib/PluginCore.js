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
          modal.emit('update:modelValue', false)
        })
      },
      toggle(name, show) {
        const modal = this.modals.find(modal => modal.name === name)
        if (modal !== undefined) {
          modal.emit('update:modelValue', show === undefined ? !modal.value : show)
        }
      }
    }
    return vfm
  }
}

export function bindPrototype(app, { key }) {
  const vfm = createVfm()()
  Object.defineProperty(app.config.globalProperties, key, {
    get() {
      return vfm
    }
  })
  app.provide(key, vfm)
}

export function registComponent(app, { componentName, key }) {
  app.component(componentName, {
    ...VueFinalModal,
    props: { ...VueFinalModal.props, _key: { type: String, default: key } }
  })
}
