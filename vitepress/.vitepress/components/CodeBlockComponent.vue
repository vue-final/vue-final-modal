<template>
  <PCodeBlockComponent
    :importComponentInstanceFn="() => import(`../../${filename}.vue`)"
    :importComponentRawFn="() => import(`../../${filename}.vue?raw`)"
  />
</template>

<script>
import { CodeBlockComponent as PCodeBlockComponent } from '@planetar/code-block'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CodeBlockComponent',
  components: { PCodeBlockComponent },
  props: {
    filename: { type: String },
  },
  setup() {},
})
</script>
