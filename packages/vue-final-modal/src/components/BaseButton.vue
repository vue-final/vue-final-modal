<template>
  <button class="base-button" v-on="$listeners">
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
.base-button {
  @apply mx-1 px-2 py-1 border border-gray-700 rounded;
  &:hover {
    @apply bg-gray-400;
  }
  &:focus {
    @apply outline-none;
  }
}
</style>
