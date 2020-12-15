import { bindPrototype, registComponent } from './PluginCore'
import { DUPLICATE_PLUGIN_COMPONENT, DUPLICATE_COMPONENT } from './utils/errors'

const defaultOptions = {
  componentName: 'VueFinalModal',
  key: '$vfm'
}

const Plugin = () => ({
  install(app, options) {
    const _options = Object.assign({}, defaultOptions, options)
    const isDuplicateKey = app.config.globalProperties[_options.key]
    const isDuplicateComponent = app._context.components[_options.componentName]

    if (isDuplicateComponent) {
      if (typeof window !== 'undefined') {
        console.warn(isDuplicateKey ? DUPLICATE_PLUGIN_COMPONENT : DUPLICATE_COMPONENT)
      }
    } else {
      if (!isDuplicateKey) {
        bindPrototype(app, _options)
      }
      registComponent(app, _options)
    }
  }
})

export default Plugin
