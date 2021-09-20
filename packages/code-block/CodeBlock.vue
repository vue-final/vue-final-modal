<template>
  <ClientOnly>
    <NConfigProvider :theme="theme">
      <NTabs default-value="example" type="line">
        <NTabPane name="example" tab="Example" class="expand">
          <div class="example-wrapper">
            <component :is="component"></component>
          </div>
        </NTabPane>
        <NTabPane v-if="template" name="template" tab="Template">
          <Prism>{{ template }}</Prism>
        </NTabPane>
        <NTabPane v-if="script" name="script" tab="Script">
          <Prism>{{ script }}</Prism>
        </NTabPane>
        <NTabPane v-if="style" name="style" tab="Style">
          <Prism>{{ style }}</Prism>
        </NTabPane>
      </NTabs>
    </NConfigProvider>
  </ClientOnly>
</template>

<script>
import { computed, ref, shallowRef, defineAsyncComponent } from 'vue'
import { parseComponent } from 'vue-sfc-parser'
import { NConfigProvider, NTabs, NTabPane, darkTheme } from 'naive-ui'

if (!import.meta.env.SSR) {
  window.Prism = window.Prism || {}
  Prism.manual = true
}

export default {
  components: {
    NTabs,
    NTabPane,
    NConfigProvider,
    Prism: defineAsyncComponent(() => import('./Prism.vue'))
  },
  props: {
    importComponentInstanceFn: {
      type: Function,
      default: () => {}
    },
    importComponentRawFn: {
      type: Function,
      default: () => {}
    },
    isDark: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const theme = computed(() => {
      return props.isDark ? darkTheme : null
    })

    const component = shallowRef({ render() {} })

    props.importComponentInstanceFn().then(res => {
      component.value = res.default
    })

    const template = ref('')
    const script = ref('')
    const style = ref('')

    props.importComponentRawFn().then(res => {
      const SFC = parseComponent(res.default)

      template.value = `<${SFC.template.type}${Object.keys(SFC.template.attrs).reduce((acc, cur) => {
        if (typeof SFC.template.attrs[cur] === 'boolean') {
          acc += ` ${cur}`
        } else {
          acc += ` ${cur}="${SFC.template.attrs[cur]}"`
        }
        return acc
      }, '')}>${SFC.template.content}</${SFC.template.type}>`

      script.value = `<${SFC.script.type}${Object.keys(SFC.script.attrs).reduce((acc, cur) => {
        if (typeof SFC.script.attrs[cur] === 'boolean') {
          acc += ` ${cur}`
        } else {
          acc += ` ${cur}="${SFC.script.attrs[cur]}"`
        }
        return acc
      }, '')}>${SFC.script.content}</${SFC.script.type}>`

      style.value = SFC.styles.reduce((acc, cur) => {
        acc += `<${cur.type}${Object.keys(cur.attrs).reduce((a, c) => {
          if (typeof cur.attrs[c] === 'boolean') {
            a += ` ${c}`
          } else {
            a += ` ${c}="${cur.attrs[c]}"`
          }
          return a
        }, '')}>${cur.content}</${cur.type}>\n\n`
        return acc
      }, '')
    })

    return {
      theme,
      component,
      template,
      script,
      style
    }
  }
}
</script>

<style scoped>
::v-deep(.n-tabs-wrapper) {
  width: 100%;
}

::v-deep(.n-tabs-wrapper) .expand {
  margin-right: auto;
}

.example-wrapper {
  padding: 1rem 0;
}
</style>
