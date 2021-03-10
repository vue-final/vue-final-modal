const requireModule = require.context('.', true, /\.vue$/)
const modules = {}

requireModule.keys().forEach(fileName => {
  let moduleName = fileName.replace(/(\.\/|\.vue)/g, '')
  moduleName = moduleName.split('/')[moduleName.split('/').length - 1]

  modules[moduleName] = {
    ...requireModule(fileName).default
  }
})

export default modules
