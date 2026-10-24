export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (_html) => {
    // console.log('render:html', html)
  })
})
