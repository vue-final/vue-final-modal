<template>
  <Layout>
    <template #sidebar-top>
      <ThemeToggle class="mt-4 px-6" />
    </template>
  </Layout>
</template>

<script>
// import { nextTick, onMounted } from 'vue'
import DefaultTheme from 'vitepress/theme'
const { Layout } = DefaultTheme
// import { isDark } from '../theme/dark'

export default {
  components: {
    Layout
  }
  // setup() {
  // const isDark = useDark(darkStorageConfig)
  // onMounted(() => {
  //   nextTick(() => {
  //     isDark.value = !isDark.value
  //     return nextTick()
  //   }).then(() => {
  //     isDark.value = !isDark.value
  //   })
  // })
  // }
}
</script>
