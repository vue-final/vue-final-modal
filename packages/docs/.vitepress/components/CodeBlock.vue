<template>
  <ClientOnly>
    <NConfigProvider :theme="theme">
      <NTabs default-value="example" type="line">
        <NTabPane name="example" tab="Example" class="mr-auto">
          <div class="py-8">
            <component :is="component">
              <slot></slot>
            </component>
          </div>
        </NTabPane>
        <NTabPane name="template" tab="Template">
          <Prism>{{ template }}</Prism>
        </NTabPane>
        <NTabPane name="script" tab="Script">
          <Prism>{{ script }}</Prism>
        </NTabPane>
        <NTabPane name="style" tab="Style">
          <Prism>{{ style }}</Prism>
        </NTabPane>
      </NTabs>
    </NConfigProvider>
  </ClientOnly>
</template>

<script>
import { computed, ref, shallowRef } from 'vue'
import { getTagHtmlFromCodeString } from '../regexp.js'
import { NTabs, NTabPane } from 'naive-ui'
import { darkTheme, NConfigProvider } from 'naive-ui'
import { isDark } from '@/theme/dark'

export default {
  components: {
    NTabs,
    NTabPane,
    NConfigProvider
  },
  props: {
    componentFn: {
      type: Function,
      default: () => {}
    },
    codeFn: {
      type: Function,
      default: () => {}
    }
  },
  setup(props) {
    const theme = computed(() => {
      return isDark.value ? darkTheme : null
    })

    const component = shallowRef({ render() {} })

    props.componentFn().then(res => {
      component.value = res.default
    })

    const template = ref('')
    const script = ref('')
    const style = ref('')

    props.codeFn().then(res => {
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
  @apply w-full;
}
</style>
