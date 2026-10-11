<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[] | null | undefined>>('navigation')
const route = useRoute()

const sections = computed(() => (navigation?.value ?? [])
  .filter(item => item.children?.length)
  .map(item => ({
    label: item.title,
    to: getFirstPagePath(item),
    active: route.path === item.path || route.path.startsWith(`${item.path}/`),
  })))
</script>

<template>
  <UNavigationMenu :items="sections" variant="pill" :ui="{ link: 'px-4 py-2 text-default' }" class="justify-center" />
</template>
