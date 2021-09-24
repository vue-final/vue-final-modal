import VueFinalModalComponent from './VueFinalModal.vue'
import ModalsContainerComponent from './ModalsContainer.vue'
import { markRaw, reactive, shallowReactive } from 'vue'

export class ModalInstance {
  constructor() {
    const bindApi = component => {
      const _component = { ...component, props: { ...component.props } }
      Object.assign(_component.props, {
        api: { type: Object, default: () => this }
      })
      return markRaw(_component)
    }

    this.modals = []
    this.openedModals = []
    this.VueFinalModal = bindApi(VueFinalModalComponent)

    this.dynamicModals = shallowReactive([])
    this.ModalsContainer = bindApi(ModalsContainerComponent)
  }

  show(modal, ...args) {
    switch (typeof modal) {
      case 'string':
        return this.toggle(modal, true, ...args)
      case 'object': {
        const { show } = this.useModal(modal, args[0])
        return show()
      }
    }
  }

  hide(...names) {
    return this.toggle(names, false)
  }

  hideAll() {
    return this.hide(...this.openedModals.map(modal => modal.props.name))
  }

  toggle(name, ...args) {
    const modals = Array.isArray(name) ? this.get(...name) : this.get(name)
    return Promise.allSettled(modals.map(modal => modal.toggle(...args)))
  }

  get(...names) {
    return this.modals.filter(modal => names.includes(modal.props.name))
  }

  existModal(options) {
    return this.dynamicModals.indexOf(options) !== -1
  }

  useModal(_options, params = {}) {
    let options = reactive({
      value: false,
      component: this.VueFinalModal,
      id: Symbol('useModal'),
      bind: {},
      slots: {},
      on: {},
      params,
      ..._options
    })

    const show = () => {
      return this.existModal(options)
        ? Promise.resolve('[Vue Final Modal] modal is already opened')
        : new Promise((resolve, reject) => {
            options.value = true
            options.reject = reject
            options.opened = () => {
              resolve('show')
            }
            this.dynamicModals.push(options)
          })
    }

    const hide = () => {
      return this.existModal(options)
        ? new Promise((resolve, reject) => {
            options.value = false
            options.rejectClose = reject
            options.closed = () => {
              resolve('hide')
            }
          })
        : Promise.resolve('[Vue Final Modal] modal is already closed')
    }

    return { show, hide, options }
  }
}

/**
 * @description Support create multiple modal instance
 */
export const createModalInstance = () => {
  let modalInstance = new ModalInstance()
  return {
    $vfm: modalInstance,
    VueFinalModal: modalInstance.VueFinalModal,
    ModalsContainer: modalInstance.ModalsContainer,
    useModal: modalInstance.useModal.bind(modalInstance)
  }
}

/**
 * @description Create modal instance by default for directly support `import { $vfm, VueFinalModal, ModalsContainer, useModal } from 'vue-final-modal'`
 */
const modalInstance = createModalInstance()

export const { $vfm, VueFinalModal, ModalsContainer, useModal } = modalInstance
