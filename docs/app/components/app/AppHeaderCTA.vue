<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
  <UContentSearchButton :collapsed="false" color="neutral" variant="ghost" class="hidden lg:flex" />
  <UButton
    v-if="appConfig.socials?.x"
    :to="appConfig.socials.x"
    target="_blank"
    icon="i-simple-icons-x"
    color="neutral"
    variant="ghost"
    aria-label="X"
  />
</template>
