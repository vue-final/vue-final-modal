<script setup lang="ts">
// import { transformContent } from '../../transformers'
// import { useAsyncData } from '#imports'

// const props = defineProps<{
//   path: string
//   language?: string
//   filename?: string
// }>()

// const modules = import.meta.glob(['./*.vue', '!./CodeBlockFile.vue'], { as: 'raw' })
// console.log(`modules → `, modules)

// function prepareContent(content: string) {
//   return `\`\`\`${props.language || ''}${props.filename ? ` [${props.filename}]` : ''}\n${content}\n\`\`\``
// }

// const { data: doc } = await useAsyncData(`playground-${props.path}`, async () => {
//   try {
//     const module = modules[props.path]
//     if (!module)
//       console.error('Component Not Found.')

//     const content = prepareContent(await module() as any)
//     // console.log(`content → `, content)
//     const parsed = await transformContent('content:index.md', content)
//     return parsed
//   }
//   catch (e) {
//     return doc.value
//   }
// })
</script>

<template>
  <div>TBD</div>
  <!-- <ContentRenderer :key="doc.updatedAt" class="docus-content" :value="doc">
    <template #empty>
      <div class="p-8">
        <Alert type="warning">
          <p class="font-semibold">
            Content is empty!
          </p>
          <br><br>
          <p>
            Type any <span class="font-semibold">Markdown</span> or <span class="font-semibold">MDC code</span> in
            editor to see it replaced by rendered nodes in this panel.
          </p>
        </Alert>
      </div>
    </template>
  </ContentRenderer> -->
</template>

<style scoped>
.docus-content :deep(.filename) {
  display: block;
}
</style>
