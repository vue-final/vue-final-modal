<template>
  <div>
    <button @click="showModal = true" class="vfm-btn mb-4">Attach</button>
    <vue-final-modal
      v-model="showModal"
      classes="flex justify-center items-center"
      content-class="w-2/3 max-h-1/2 p-2 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded overflow-auto"
      attach="#attach"
      :lock-scroll="false"
    >
      <span class="text-2xl"># Attach modal</span>
      <base-lorem />
    </vue-final-modal>
    <div
      id="attach"
      class="relative flex justify-center items-center w-full h-64 dark:bg-gray-700 border dark:border-gray-700"
    >
      #attach
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    showModal: false
  })
}
</script>
