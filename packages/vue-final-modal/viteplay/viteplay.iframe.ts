import { createVfm } from '../src/index'

export default {
  extend({ app }: any) {
    app.use(createVfm())
  },
}
