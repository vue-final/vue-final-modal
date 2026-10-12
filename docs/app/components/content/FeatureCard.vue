<script setup lang="ts">
defineProps<{
  icon: string
}>()
</script>

<template>
  <UPageCard
    :icon="icon"
    :ui="{ root: 'rounded-2xl', container: 'sm:p-8', leadingIcon: 'size-6 text-highlighted', title: 'text-xl', description: 'text-base' }"
  >
    <template #title>
      <slot name="title" mdc-unwrap="p" />
    </template>
    <template #description>
      <slot name="description" mdc-unwrap="p" />
    </template>
  </UPageCard>
</template>
