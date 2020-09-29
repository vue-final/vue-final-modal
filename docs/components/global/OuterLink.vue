<template>
  <a :href="url" class="codepen-link" target="_blank" rel="noopener noreferrer">
    SEE PEN
    <OutboundLink></OutboundLink>
  </a>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.codepen-link {
  @apply text-gray-600 text-sm font-medium inline-flex items-center;
}
.codepen-link:hover {
  @apply underline;
}
.codepen-link::before {
  content: unset;
}
.dark-mode .codepen-link {
  @apply text-gray-400;
}
</style>
