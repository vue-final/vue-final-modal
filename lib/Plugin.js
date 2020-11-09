import { bindPrototype, registComponent } from './PluginCore'
import { DUPLICATE_PLUGIN_COMPONENT, DUPLICATE_COMPONENT } from './utils/errors'

const defaultOptions = {
  componentName: 'VueFinalModal',
  key: '$vfm'
}

const Plugin = () => ({
  install(Vue, options) {
    const _options = Object.assign({}, defaultOptions, options)
    const isDuplicateCmd = Vue.prototype[_options.key]
    const isDuplicateComponent = Vue.options.components[_options.componentName]

    if (isDuplicateComponent) {
      console.warn(isDuplicateCmd ? DUPLICATE_PLUGIN_COMPONENT : DUPLICATE_COMPONENT)
    } else {
      if (!isDuplicateCmd) {
        bindPrototype(Vue, _options)
      }
      registComponent(Vue, _options)
    }
  }
})

export default Plugin
