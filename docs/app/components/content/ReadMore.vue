<script setup lang="ts">
import { splitByCase, upperFirst } from 'scule'

const props = defineProps({
  link: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: false,
    default: undefined,
  },
})

const createTitle = (title, link) => (title || link.split('/').filter(Boolean).map(part => splitByCase(part).map(p => upperFirst(p)).join(' ')).join(' > ').replace('Api', 'API'))

const computedTitle = computed(() => createTitle(props.title, props.link))
</script>

<template>
  <p class="flex items-center gap-1 rounded-lg border border-default px-3 py-2">
    <UIcon class="inline-block w-5 h-5" name="i-heroicons-information-circle" />
    Read more in
    <NuxtLink class="text-primary" :to="link">
      {{ computedTitle }}
    </NuxtLink>.
  </p>
</template>
