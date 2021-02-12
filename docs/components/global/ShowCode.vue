<template>
  <details>
    <summary class="outline-none underline">{{ text }}</summary>
    <slot />
  </details>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: 'Show code'
    }
  }
}
</script>
