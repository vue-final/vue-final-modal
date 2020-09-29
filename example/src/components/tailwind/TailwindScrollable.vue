<template>
  <div>
    <vue-final-modal
      v-model="showModal"
      classes="flex justify-center items-center"
      content-class="relative p-4 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded overflow-auto"
    >
      <span class="text-2xl mb-2"># Hello, world!</span>
      <base-lorem v-for="i in 10" :key="i" />
      <base-lorem />
      <base-lorem />
      <base-lorem />
      <base-lorem />
      <base-lorem />
      <base-lorem />
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry.
      </p>
      <button
        class="absolute top-0 right-0 mt-2 mr-4 text-3xl hover:text-gray-700 leading-none focus:outline-none"
        @click="showModal = false"
      >
        x
      </button>
    </vue-final-modal>
    <button class="vfm-btn" @click="showModal = true">Scoll</button>
  </div>
</template>

<script>
export default {
  data: () => ({
    showModal: false
  })
}
</script>

<style scoped>
::v-deep .vfm__content {
  max-height: 90%;
}
</style>
