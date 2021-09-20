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
import { getTagHtmlFromCodeString } from './regexp.js'
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
      template.value = getTagHtmlFromCodeString('template', res.default)
      script.value = getTagHtmlFromCodeString('script', res.default)
      style.value = getTagHtmlFromCodeString('style', res.default)
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
