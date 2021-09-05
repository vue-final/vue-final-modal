<template>
  <div>
    <VueFinalModal v-model="showModal">
      <span class="modal__title">Hello, VueFinalModal</span>
    </VueFinalModal>
    <button highlight @click="showModal = true">Open modal</button>
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
.modal__title {
  font-size: 1.5rem;
  font-weight: 700;
}
</style>
