<template>
  <div>
    <vue-final-modal
      v-model="showModal"
      classes="flex justify-center items-center"
      content-class="w-2/3 max-h-1/2 p-4 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded overflow-auto"
      attach="#attach"
      :lock-scroll="false"
    >
      <base-lorem />
    </vue-final-modal>
    <base-button @click="showModal = true">Attach</base-button>
  </div>
</template>

<script>
export default {
  data: () => ({
    showModal: false
  })
}
</script>
