<template>
  <Layout>
    <template #sidebar-top>
      <ThemeToggle class="mt-4 px-6" />
    </template>
  </Layout>
</template>

<script>
import DefaultTheme from 'vitepress/theme'
const { Layout } = DefaultTheme

export default {
  components: {
    Layout
  }
}
</script>
