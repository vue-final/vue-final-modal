<template>
  <div class="mt-8">
    <CodeBlockComponent v-bind="$attrs" :is-dark="isDark"></CodeBlockComponent>
  </div>
</template>

<script>
import { CodeBlock as CodeBlockComponent } from '@hunterliu/code-block'
import { isDark } from '@/theme/dark'

export default {
  inheritAttrs: false,
  components: {
    CodeBlockComponent
  },
  setup() {
    return {
      isDark
    }
  }
}
</script>
