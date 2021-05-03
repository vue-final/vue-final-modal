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
            return this.toggle(modal, true, ...args)
          case 'object': {
            return Promise.allSettled([
              new Promise((resolve, reject) => {
                const defaultModal = {
                  value: true,
                  id: Symbol('dynamicModal'),
                  component: options.componentName,
                  bind: {},
                  slots: {},
                  on: {},
                  params: args[0],
                  reject,
                  opened() {
                    resolve('show')
                  }
                }
                this.dynamicModals.push(shallowReactive(Object.assign(defaultModal, modal)))
              })
            ])
          }
        }
      },
      hide(...names) {
        return this.toggle(names, false)
      },
      hideAll() {
        return this.hide(...this.openedModals.map(modal => modal.props.name))
      },
      toggle(name, ...args) {
        const modals = Array.isArray(name) ? this.get(...name) : this.get(name)
        return Promise.allSettled(modals.map(modal => modal.toggle(...args)))
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
