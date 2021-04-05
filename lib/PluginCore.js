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
            return this.toggle(modal, true, ...args)
          case 'object': {
            return new Promise(resolve => {
              const defaultModal = {
                value: true,
                id: Symbol('dynamicModal'),
                component: options.componentName,
                bind: {},
                slots: {},
                on: {},
                params: args[0],
                opened() {
                  resolve('show')
                }
              }
              this.dynamicModals.push(Object.assign(defaultModal, modal))
            })
          }
        }
      },
      hide(...names) {
        return this.toggle(names, false)
      },
      hideAll() {
        return this.hide(...this.openedModals.map(modal => modal.name))
      },
      toggle(name, ...args) {
        const modals = Array.isArray(name) ? this.get(...name) : this.get(name)
        return Promise.allSettled(modals.map(modal => modal.toggle(...args)))
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
