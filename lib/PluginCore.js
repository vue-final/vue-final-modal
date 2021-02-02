import VueFinalModal from './VueFinalModal.vue'
import ModalsContainer from './ModalsContainer.vue'
import { shallowReactive } from 'vue'

function assignOptions(component, options) {
  const _component = { ...component }
  Object.assign(_component.props, {
    options: { type: Object, default: () => options }
  })
  return _component
}

function createVfm(options) {
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
              this.dynamicModals.push(shallowReactive(Object.assign(defaultModal, modal)))
            }
            break
        }
      },
      hide(...names) {
        this.toggle(names, false)
      },
      hideAll() {
        for (let i = this.openedModals.length - 1; i >= 0; i--) {
          this.openedModals[i].emit('update:modelValue', false)
        }
      },
      toggle(name, ...args) {
        const modals = Array.isArray(name) ? this.get(...name) : this.get(name)
        modals.forEach(modal => modal.toggle(...args))
      },
      get(...names) {
        return this.modals.filter(modal => names.includes(modal.props.name))
      },
      dynamicModals: shallowReactive([]),
      openedModals: [],
      modals: []
    }
    return vfm
  }
}

export function bindPrototype(app, options) {
  const vfm = createVfm(options)()
  Object.defineProperty(app.config.globalProperties, options.key, {
    get() {
      return vfm
    }
  })
  app.provide(options.key, vfm)
}

export function registModal(app, options) {
  app.component(options.componentName, assignOptions(VueFinalModal, options))
}
export function registContainer(app, options) {
  app.component(options.dynamicContainerName, assignOptions(ModalsContainer, options))
}
