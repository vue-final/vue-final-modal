<template>
  <PCodeBlockComponent
    :importComponentInstanceFn="() => import(`./${filename}.vue`)"
    :importComponentRawFn="() => import(`./${filename}.vue?raw`)"
  />
</template>

<script>
import { CodeBlockComponent as PCodeBlockComponent } from '@planetar/code-block'

export default {
  name: 'CodeBlockComponent',
  components: { PCodeBlockComponent },
  props: {
    filename: { type: String }
  }
}
</script>
