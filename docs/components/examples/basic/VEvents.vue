<template>
  <div>
    <custom-modal
      v-model="showModal"
      @click-outside="clickOutside"
      @before-open="beforeOpen"
      @opened="opened"
      @before-close="beforeClose"
      @closed="closed"
      @cancel="showModal = false"
    >
      <template v-slot:title>Events Example!</template>
    </custom-modal>
    <v-button highlight @click="showModal = true">Open modal</v-button>
  </div>
</template>

<script>
export default {
  data: () => ({
    showModal: false
  }),
  methods: {
    clickOutside() {
      alert('click-outside')
    },
    beforeOpen() {
      alert('beforeOpen')
    },
    opened() {
      alert('opened')
    },
    beforeClose() {
      alert('beforeClose')
    },
    closed() {
      alert('closed')
    }
  }
}
</script>
