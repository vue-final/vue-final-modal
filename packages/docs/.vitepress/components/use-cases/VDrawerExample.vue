<template>
  <v-drawer v-model="showModal">
    <span class="pl-2 text-cool-gray-800 text-lg font-bold">Swipe-able modal</span>
    <div class="tabs flex items-center w-full px-2 overflow-x-auto h-8 space-x-4">
      <div v-for="i in 20" :key="i" class="flex justify-center items-center min-w-20 px-1 text-white bg-cool-gray-800 rounded">Tab {{ i }}</div>
    </div>
    <div class="flex justify-center items-center w-full h-40 text-cool-gray-800">Touch and Swipe -></div>
  </v-drawer>
  <v-button highlight @click="showModal = true">Open modal</v-button>
</template>

<script>
export default {
  data: () => ({
    showModal: false
  })
}
</script>

<style scoped>
.tabs::-webkit-scrollbar {
    display: none;
}
</style>