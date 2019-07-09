import { configure, addParameters } from '@storybook/vue'

addParameters({
  options: {
    theme: {
      brandTitle: 'nuxt blog',
      brandUrl: 'https://github.com/hunterliu1003/blog'
    },
    panelPosition: 'right'
  }
})

const req = require.context('@/stories', true, /stories\.js$/)

function loadStories() {
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
