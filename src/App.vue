<template>
  <div id="app" class="p-4">
    <base-github-corner />
    <h1 class="text-center text-3xl text-white">vue-final-modal</h1>
    <h2 class="text-center text-2xl my-16 text-white">Features</h2>
    <div class="flex flex-wrap justify-center space-x-4">
      <!-- <base-example-optional-modal /> -->
      <base-example />
      <base-example-lock-scroll />
      <base-example-hide-overlay />
      <base-example-click-to-close />
      <base-example-prevent-click />
      <base-example-stackable />
      <base-example-scroll />
    </div>
    <div
      id="attach"
      style="max-width: 500px;"
      class="flex justify-center items-center relative w-full h-64 mx-auto mt-16 bg-red-200"
    >
      <base-example-attach />
    </div>
    <!-- <h2 class="text-center text-2xl my-4 text-white">Roadmap</h2>
    <div class="flex flex-wrap justify-center">
      <base-example-drag />
      <base-example-resizable />
      <base-example-dynamic />
    </div> -->
    <div v-for="i in 100" :key="i" class="text-white text-center h-4"></div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$ga.page('/')
  }
}
</script>

<style lang="scss">
body {
  @apply bg-gray-800;
}
</style>
