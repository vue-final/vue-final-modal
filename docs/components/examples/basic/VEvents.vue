<template>
  <div>
    <v-modal
      v-model="showModal"
      @click-outside="clickOutside"
      @before-open="beforeOpen"
      @opened="opened"
      @before-close="beforeClose"
      @closed="closed"
      @cancel="showModal = false"
    >
      <template #title>Events Example!</template>
    </v-modal>
    <button class="vfm-btn" @click="showModal = true">Open modal</button>
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
