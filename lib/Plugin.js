import { bindPrototype, registComponent } from './PluginCore'
import { DUPLICATE_PLUGIN_COMPONENT, DUPLICATE_COMPONENT } from './utils/errors'

const defaultOptions = {
  name: 'VueFinalModal',
  cmd: '$vfm'
}

const Plugin = () => ({
  install(Vue, options) {
    const _options = Object.assign({}, defaultOptions, options)
    const isDuplicateCmd = Vue.prototype[_options.cmd]
    const isDuplicateComponent = Vue.options.components[_options.name]

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
