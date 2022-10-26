import { createVfm } from 'vue-final-modal'

export default {
  // Optional function to extend the Vue app instance
  extend({ app }: any) {
    app.use(createVfm())
    // app is the Vue app instance
    // you can add Vue plugins normally like this:
    // app.use(SomePlugin)
  },
}
