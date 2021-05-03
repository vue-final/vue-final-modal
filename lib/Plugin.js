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
  install(app, options) {
    const _options = Object.assign({}, defaultOptions, pluginOptions, options)
    const duplicateKey = app.config.globalProperties[_options.key]
    const duplicateComponent = app._context.components[_options.componentName]
    const duplicateDynamicContainer = app._context.components[_options.dynamicContainerName]

    if (validPlugin(duplicateKey, duplicateComponent, duplicateDynamicContainer)) {
      bindPrototype(app, _options)
      registModal(app, _options)
      registContainer(app, _options)
    }
  }
})

export default Plugin
