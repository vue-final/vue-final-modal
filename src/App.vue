<template>
  <div id="app" class="p-4">
    <vue-final-modal
      v-model="showModal"
      classes="flex justify-center items-center"
      content-class="w-2/3 max-h-1/2 p-4 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded overflow-auto"
    >
      <h2 class="text-2xl mb-2"># Simple Modal</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eget lacus
        et urna tincidunt imperdiet. Sed sagittis nisl sed felis molestie, quis
        aliquet nulla iaculis. Maecenas risus quam, dictum a magna sit amet,
        rutrum sagittis turpis. Nulla lobortis ipsum a est tincidunt, vel
        lobortis dolor dignissim. Mauris cursus condimentum interdum. Ut
        venenatis purus a purus semper, sed posuere arcu dapibus. Proin non
        metus tempus, accumsan ante eu, ullamcorper felis. Sed sed justo non
        felis iaculis finibus. Nam ipsum diam, consectetur eget efficitur id,
        malesuada dignissim magna. Sed sagittis, turpis ac posuere lacinia,
        risus massa ornare eros, vitae condimentum lorem ante eget nisi. Proin
        eget ornare lacus, suscipit lacinia turpis. Nam eu ante sed libero
        tristique consequat eu non sapien.
      </p>
    </vue-final-modal>
    <button class="base-button" @click="showModal = true">Simple</button>
  </div>
</template>

<script>
export default {
  data: () => ({
    showModal: false
  })
}
</script>

<style lang="scss" scoped>
.base-button {
  @apply px-2 py-1 border rounded;
  &:focus {
    @apply outline-none;
  }
}
</style>
