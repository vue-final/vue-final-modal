import { bindPrototype, registModal, registContainer } from './PluginCore'
import { DUPLICATE_PLUGIN_COMPONENT, DUPLICATE_COMPONENT, DUPLICATE_DYNAMIC_CONTAINER } from './utils/errors'

const defaultOptions = {
  componentName: 'VueFinalModal',
  dynamicContainerName: 'ModalsContainer',
  key: '$vfm'
}

const Plugin = () => ({
  install(app, options) {
    const _options = Object.assign({}, defaultOptions, options)
    const isDuplicateKey = app.config.globalProperties[_options.key]
    const isDuplicateComponent = app._context.components[_options.componentName]
    const isDuplicateDynamicContainer = app._context.components[_options.dynamicContainerName]

    if (isDuplicateComponent || isDuplicateDynamicContainer) {
      if (typeof window !== 'undefined') {
        if (isDuplicateKey) {
          console.error(DUPLICATE_PLUGIN_COMPONENT)
        }
        if (isDuplicateComponent) {
          console.error(DUPLICATE_COMPONENT)
        }
        if (isDuplicateDynamicContainer) {
          console.error(DUPLICATE_DYNAMIC_CONTAINER)
        }
      }
    } else {
      if (!isDuplicateKey) {
        bindPrototype(app, _options)
      }
      registModal(app, _options)
      registContainer(app, _options)
    }
  }
})

export default Plugin
