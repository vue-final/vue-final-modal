<template>
  <img v-if="!isDark" src="/preview.png" class="light-img" alt="Vue Final Modal Logo" />
  <img v-else src="/preview-dark.png" class="dark-img" alt="Vue Final Modal Logo" />
</template>

<script setup>
import { isDark } from '../theme/dark'
</script>
