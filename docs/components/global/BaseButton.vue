<template>
  <button class="base-button" v-on="$listeners">
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
.base-button {
  @apply px-2 py-1 border rounded;
  &:focus {
    @apply outline-none;
  }
}
</style>
