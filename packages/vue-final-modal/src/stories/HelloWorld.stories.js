import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import HelloWorld from '@/components/HelloWorld.vue'

Vue.component('HelloWorld', HelloWorld)

storiesOf('HelloWorld').add('HelloWorld', () => ({
  template: `<HelloWorld />`
}))
