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
        const modals = this.get(name)
        modals.forEach(modal => modal.toggle(...args))
      },
      get(name) {
        return this.modals.filter(modal => modal.name === name)
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
