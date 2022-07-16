# @hunterliu/code-block

```bash
npm i @hunterliu/code-block
```

```vue
<template>
  <CodeBlock
    :importComponentInstanceFn="() => import('path/to/component.vue')"
    :importComponentRawFn="() => import('path/to/component.vue?raw')"
  ></CodeBlock>
</template>
<script>
import { CodeBlock } from '@hunterliu/code-block'

export default {
  components: {
    CodeBlock
  }
}
</script>
```
