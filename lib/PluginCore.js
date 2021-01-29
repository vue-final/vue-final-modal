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
                value: true,
                id: Symbol('dynamicModal'),
                component: options.componentName,
                bind: {},
                slots: {},
                on: {},
                params: args[0]
              }
              this.dynamicModals.push(Object.assign(defaultModal, modal))
            }
            break
        }
      },
      hide(...names) {
        this.toggle(names, false)
      },
      hideAll() {
        for (let i = this.openedModals.length - 1; i >= 0; i--) {
          this.openedModals[i].$emit('input', false)
        }
      },
      toggle(name, ...args) {
        const modals = Array.isArray(name) ? this.get(...name) : this.get(name)
        modals.forEach(modal => modal.toggle(...args))
      },
      get(...names) {
        return this.modals.filter(modal => names.includes(modal.name))
      },
      dynamicModals: [],
      openedModals: [],
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
