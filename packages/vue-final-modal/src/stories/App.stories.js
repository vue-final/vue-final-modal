import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import App from '@/App.vue'

Vue.component('App', App)

storiesOf('App').add('App', () => ({
  template: `<App />`
}))
