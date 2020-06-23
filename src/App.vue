<template>
  <div id="app" class="p-4">
    <!-- <base-example-optional-modal /> -->
    <h2 class="text-2xl my-2 text-white">Done</h2>
    <div class="flex flex-wrap">
      <base-example />
      <base-example-lock-scroll />
      <base-example-hide-overlay />
      <base-example-click-to-close />
      <base-example-prevent-click />
      <base-example-stackable />
      <base-example-scroll />
    </div>
    <h2 class="text-2xl my-2 text-white">Roadmap</h2>
    <div class="flex flex-wrap">
      <base-example-attach />
      <base-example-drag />
      <base-example-resizable />
      <base-example-transition />
      <base-example-z-index />
      <base-example-dynamic />
      <base-example-spinner />
      <base-example-toast />
    </div>
    <div v-for="i in 100" :key="i" class="text-white text-center">{{ i }}</div>
  </div>
</template>

<style lang="scss">
body {
  @apply bg-gray-800;
}
</style>
