import { defineApi, defineModal, defineContainer } from './PluginCore'

/**
 * @description Ensure that `_vfm` is used when function `installPlugin` is executed for the first time
 */
let _count = 0

const _key = '$vfm'
const _componentName = 'VueFinalModal'
const _dynamicContainerName = 'ModalsContainer'

/**
 * @description Support create multiple vfm instance
 */
export const defineVfm = () => {
  let api = defineApi()
  return {
    [_key]: api,
    [_componentName]: defineModal(api),
    [_dynamicContainerName]: defineContainer(api)
  }
}

/**
 * @description Create a vfm instance by default for directly support `import { $vfm, VueFinalModal, ModalsContainer } from 'vue-final-modal'`
 */
const _vfm = defineVfm()
export const { $vfm, VueFinalModal, ModalsContainer } = _vfm

/**
 * @description Register vfm instance globally
 * @deprecated not available in vue-final-modal 4
 */
const installVfm = (App, options = {}) => {
  const { $vfm, VueFinalModal, ModalsContainer } = _count === 0 ? _vfm : defineVfm()
  _count += 1
  const key = options.key || _key
  const componentName = options.componentName || _componentName
  const dynamicContainerName = options.dynamicContainerName || _dynamicContainerName
  Object.defineProperty(App.config.globalProperties, key, {
    get() {
      return $vfm
    }
  })
  App.provide(key, $vfm)
  App.component(componentName, VueFinalModal)
  App.component(dynamicContainerName, ModalsContainer)
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
