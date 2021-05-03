import { bindPrototype, registModal, registContainer } from './PluginCore'
import { DUPLICATE_KEY, DUPLICATE_COMPONENT, DUPLICATE_DYNAMIC_CONTAINER } from './utils/errors'

const defaultOptions = {
  componentName: 'VueFinalModal',
  dynamicContainerName: 'ModalsContainer',
  key: '$vfm'
}

const validPlugin = (duplicateKey, duplicateComponent, duplicateDynamicContainer) => {
  if (!(duplicateKey || duplicateComponent || duplicateDynamicContainer)) return true

  if (typeof window === 'undefined') return false

  duplicateKey && console.error(DUPLICATE_KEY)
  duplicateComponent && console.error(DUPLICATE_COMPONENT)
  duplicateDynamicContainer && console.error(DUPLICATE_DYNAMIC_CONTAINER)

  return false
}

const Plugin = pluginOptions => ({
  install(Vue, options) {
    const _options = Object.assign({}, defaultOptions, pluginOptions, options)
    const duplicateKey = Vue.prototype[_options.key]
    const duplicateComponent = Vue.options.components[_options.componentName]
    const duplicateDynamicContainer = Vue.options.components[_options.dynamicContainerName]

    if (validPlugin(duplicateKey, duplicateComponent, duplicateDynamicContainer)) {
      bindPrototype(Vue, _options)
      registModal(Vue, _options)
      registContainer(Vue, _options)
    }
  }
})

export default Plugin
