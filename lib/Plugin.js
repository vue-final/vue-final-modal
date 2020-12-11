import { bindPrototype, registModal, registContainer } from './PluginCore'
import { DUPLICATE_PLUGIN_COMPONENT, DUPLICATE_COMPONENT, DUPLICATE_DYNAMIC_CONTAINER } from './utils/errors'
import mobile from 'is-mobile'

const defaultOptions = {
  componentName: 'VueFinalModal',
  dynamicContainerName: 'ModalsContainer',
  key: '$vfm',
  isMobile: mobile()
}

const Plugin = () => ({
  install(Vue, options) {
    const _options = Object.assign({}, defaultOptions, options)
    const isDuplicateKey = Vue.prototype[_options.key]
    const isDuplicateComponent = Vue.options.components[_options.componentName]
    const isDuplicateDynamicContainer = Vue.options.components[_options.dynamicContainerName]

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
        bindPrototype(Vue, _options)
      }
      registModal(Vue, _options)
      registContainer(Vue, _options)
    }
  }
})

export default Plugin
