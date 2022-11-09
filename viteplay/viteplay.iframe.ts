import { createVfm } from 'vue-final-modal'
import 'vue-final-modal/style.css'

export default {
  extend({ app }: any) {
    app.use(createVfm())
  },
}
