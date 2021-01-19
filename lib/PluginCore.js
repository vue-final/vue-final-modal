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
              this.dynamicModals.push(
                shallowReactive({
                  value: true,
                  id,
                  ...modal,
                  component: modal.component,
                  slots: modal.slots,
                  bind: {
                    name: PREFIX + id,
                    ...modal.bind
                  },
                  params: args[0]
                })
              )
            }
            break
        }
      },
      hide(name) {
        this.toggle(name, false)
      },
      hideAll() {
        for (let i = this.openedModals.length - 1; i >= 0; i--) {
          this.openedModals[i].emit('update:modelValue', false)
        }
      },
      toggle(name, ...args) {
        const modals = this.get(name)
        modals.forEach(modal => modal.toggle(...args))
      },
      get(name) {
        return this.modals.filter(modal => modal.props.name === name)
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
