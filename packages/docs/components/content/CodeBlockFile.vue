<script setup lang="ts">
import { parse } from '../../markdown-parser'
import { useShiki } from '../../editor/useShiki'
import { useAsyncData } from '#imports'

const props = defineProps<{
  path?: string
  language?: string
  filename?: string
}>()

const modules = import.meta.glob('./*.vue', { as: 'raw' })

function prepareContent(content: string) {
  return `\`\`\`${props.language || ''}${props.filename ? ` [${props.filename}]` : ''}\n${content}\n\`\`\``
}

const module = modules[props.path]
if (!module)
  console.error('Component Not Found.')

const content = prepareContent(await module() as any)

const shiki = await useShiki()

const { data: doc } = await useAsyncData(`playground-${content}`, async () => {
  try {
    // const startParse = Date.now()
    let parsed = await parse(content)
    // const startHighlight = Date.now()
    parsed = await shiki(parsed as any) as any

    // console.log(`Parsed: ${startHighlight - startParse}ms, Highlighted: ${Date.now() - startHighlight}ms`)

    return {
      _id: 'content:index.md',
      _path: '/',
      _file: 'index.md',
      _extension: 'md',
      _draft: false,
      _type: 'markdown',
      updatedAt: new Date().toISOString(),
      ...parsed.meta || {},
      ...parsed,
      meta: undefined,
    }
  }
  catch (e) {
    return doc.value
  }
})
</script>

<template>
  <ContentRenderer :key="doc.updatedAt" class="docus-content" :value="doc">
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
  </ContentRenderer>
</template>

<style scoped>
.docus-content :deep(.filename) {
  display: block;
}
</style>
