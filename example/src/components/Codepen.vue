<template>
  <form action="https://codepen.io/pen/define" method="POST" target="_blank">
    <input type="hidden" name="data" :value="value" />
    <mdi-codepen @click.native="submit"></mdi-codepen>
  </form>
</template>

<script>
const title = 'Example - Vue Final Modal'

const cssResources = [
  'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons'
]

const jsResources = [
  'https://cdn.jsdelivr.net/npm/babel-polyfill/dist/polyfill.min.js',
  'https://cdn.jsdelivr.net/npm/vue/dist/vue.js',
  'https://cdn.jsdelivr.net/npm/vue-final-modal'
]

export default {
  name: 'Codepen',

  props: {
    title: {
      type: String,
      default: title
    },
    path: {
      type: String,
      required: true
    }
  },

  data: () => ({
    parsed: {}
  }),

  computed: {
    script() {
      const imports = /(import*) ([^'\n]*) from ([^\n]*)/g
      let component = /export default {([\s\S]*)}/g.exec(
        this.parsed.script || ''
      )

      component = ((component && component[1]) || '').trim()

      let script = /<script>([\s\S]*)export default {/g.exec(
        this.parsed.script || ''
      )

      script = ((script && script[1]) || '')
        .replace(imports, '')
        .replace(/\n {2}/g, '\n')
        .trim()

      script += script ? '\n\n' : ''

      return (
        `Vue.use(VueFinalModal) \n\n` +
        script +
        `new Vue({
  el: '#app',
  ${component}
})`
      )
    },
    style() {
      return {
        content: (this.parsed.style || '')
          .replace(/(<style.*?>|<\/style>)/g, '')
          .trim(),
        language: /<style.*lang=["'](.*)["'].*>/.exec(this.parsed.style || '')
      }
    },
    template() {
      const template = this.parsed.template || ''

      return template.replace(/(<template>|<\/template>$)/g, '').trim()
    },
    editors() {
      const html = this.template && 0b100
      const css = this.style.content && 0b010
      const js = this.script && 0b001

      return (html | css | js).toString(2)
    },
    value() {
      const data = {
        title: this.title,
        html: `<div id="app">
  ${this.template}
</div>`,
        css: this.style.content,
        css_pre_processor: this.style.language
          ? this.style.language[1]
          : 'none',
        css_external: [...cssResources].join(';'),
        js: this.script,
        js_pre_processor: 'babel',
        js_external: [...jsResources].join(';'),
        editors: this.editors
      }

      return JSON.stringify(data)
    }
  },
  mounted() {
    import(`!!raw-loader!./${this.path}.vue`).then(comp => {
      this.boot(comp.default)
    })
  },
  methods: {
    parseTemplate(target, template) {
      const string = `(<${target}(.*)?>[\\w\\W]*<\\/${target}>)`
      const regex = new RegExp(string, 'g')
      const parsed = regex.exec(template) || []
      return parsed[1] || ''
    },
    boot(res) {
      const template = this.parseTemplate('template', res)
      const style = this.parseTemplate('style', res)
      const script = this.parseTemplate('script', res)

      this.parsed = {
        template,
        style,
        script
      }
    },
    submit() {
      this.$el.submit()
    }
  }
}
</script>
