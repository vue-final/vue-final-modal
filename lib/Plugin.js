import { bindPrototype, registComponent } from './PluginCore'
import { DUPLICATE_PLUGIN_COMPONENT, DUPLICATE_COMPONENT } from './utils/errors'
import mobile from 'is-mobile'

const defaultOptions = {
  componentName: 'VueFinalModal',
  key: '$vfm',
  isMobile: mobile()
}

const Plugin = () => ({
  install(Vue, options) {
    const _options = Object.assign({}, defaultOptions, options)
    const isDuplicateKey = Vue.prototype[_options.key]
    const isDuplicateComponent = Vue.options.components[_options.componentName]

    if (isDuplicateComponent) {
      console.warn(isDuplicateKey ? DUPLICATE_PLUGIN_COMPONENT : DUPLICATE_COMPONENT)
    } else {
      if (!isDuplicateKey) {
        bindPrototype(Vue, _options)
      }
      registComponent(Vue, _options)
    }
  }
})

export default Plugin
