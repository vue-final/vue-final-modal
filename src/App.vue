<template>
  <div id="app">
    <VueFinalModal v-if="showModal" v-model="showModal">
      <BaseButton @click="showModal = false">close 1</BaseButton>
      <VueFinalModal
        v-model="showModal2"
        :lock-body-scroll="false"
        :click-to-close="false"
      >
        <BaseButton @click="showModal2 = false">close 2</BaseButton>
        <VueFinalModal v-if="showModal3" v-model="showModal3" hide-overlay>
          <BaseButton @click="showModal3 = false">close 3</BaseButton>
        </VueFinalModal>
        <BaseButton @click="showModal3 = true">Show third modal</BaseButton>
      </VueFinalModal>
      <BaseButton @click="showModal2 = true">Show second modal</BaseButton>
    </VueFinalModal>
    <BaseButton @click="showModal = true">Show default modal</BaseButton>
    <VueFinalModal v-if="showModal4" v-model="showModal4" hide-overlay>
      <BaseButton @click="showModal4 = false">close 4</BaseButton>
    </VueFinalModal>
    <BaseButton @click="showModal4 = true">Show forth modal</BaseButton>
    <div v-for="i in 100" :key="i">{{ i }}</div>
  </div>
</template>

<script>
import VueFinalModal from '@/components/VueFinalModal'
export default {
  components: {
    VueFinalModal
  },
  data: () => ({
    showModal: false,
    showModal2: false,
    showModal3: false,
    showModal4: false
  })
}
</script>
