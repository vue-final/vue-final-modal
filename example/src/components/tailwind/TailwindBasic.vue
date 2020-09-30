<template>
  <div>
    <vue-final-modal v-model="showModal">
      <span class="text-2xl">Hello, vue-final-modal</span>
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
