<template>
  <ClientOnly>
    <PCodeBlockComponent
      :importComponentInstanceFn="() => import(`../components/${filename}.vue`)"
      :importComponentRawFn="() => import(`../components/${filename}.vue?raw`)"
    />
  </ClientOnly>
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
