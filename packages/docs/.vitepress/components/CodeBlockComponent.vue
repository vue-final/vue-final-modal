<template>
  <ClientOnly>
    <PCodeBlockComponent
      :importComponentInstanceFn="useCases[filename][0]"
      :importComponentRawFn="useCases[filename][1]"
    />
  </ClientOnly>
</template>

<script>
import { CodeBlockComponent as PCodeBlockComponent } from '@planetar/code-block'


const useCases = {
  './use-cases/VBasic': [() => import(`./use-cases/VBasic.vue`), () => import(`./use-cases/VBasic.vue?raw`)]
}

export default {
  name: 'CodeBlockComponent',
  components: { PCodeBlockComponent },
  props: {
    filename: { type: String }
  },
  setup() {
    return {
      useCases
    }
  }
}
</script>
