<template>
  <div>
    <vue-final-modal
      v-model="showModal"
      classes="flex justify-center items-center"
    >
      <div
        class="relative p-4 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded"
      >
        <span class="text-2xl mr-8">Hello, vue-final-modal !</span>
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
      </div>
    </vue-final-modal>
    <button class="vfm-btn" @click="showModal = true">Open modal</button>
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
#__nuxt p {
  margin: 0;
}
</style>
