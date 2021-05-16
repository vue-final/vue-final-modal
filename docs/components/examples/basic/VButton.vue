<template>
  <button class="v-btn" v-on="$listeners"><span v-if="highlight">👉 </span><slot></slot></button>
</template>

<script>
export default {
  props: {
    highlight: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style scoped>
button.v-btn {
  @apply px-2 py-1 border rounded;
}
button.v-btn + button.v-btn {
  margin: 0 0 0 1rem;
}
</style>
