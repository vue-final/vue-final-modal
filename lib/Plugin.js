import {
  createModalInstance,
  $vfm as _$vfm,
  VueFinalModal as _VueFinalModal,
  ModalsContainer as _ModalsContainer
} from './modalInstance'

/**
 * @description Ensure that default modalInstance is used when function `installPlugin` is executed for the first time
 */
let _instanceCount = 0

/**
 * @description Register vfm instance globally
 * @deprecated not available in vue-final-modal 4
 */
const installVfm = (App, options = {}) => {
  const { $vfm, VueFinalModal, ModalsContainer } =
    _instanceCount === 0
      ? {
          $vfm: _$vfm,
          VueFinalModal: _VueFinalModal,
          ModalsContainer: _ModalsContainer
        }
      : createModalInstance()
  _instanceCount += 1

  Object.defineProperty(App.config.globalProperties, options.key || '$vfm', {
    get() {
      return $vfm
    }
  })
  App.provide(options.key || '$vfm', $vfm)
  App.component(options.componentName || 'VueFinalModal', VueFinalModal)
  App.component(options.dynamicContainerName || 'ModalsContainer', ModalsContainer)
}

/**
 * @description Vue plugin for register vfm instance globally
 * @deprecated not available in vue-final-modal 4
 */
export const vfmPlugin = pluginOptions => ({
  install(App, options) {
    const _options = Object.assign({}, pluginOptions, options)
    installVfm(App, _options)
  }
})

vfmPlugin.install = installVfm
