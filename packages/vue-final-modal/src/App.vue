<template>
  <div id="app">
    <VFinalModal v-if="showModal" v-model="showModal">
      <BaseButton @click="showModal = false">close 1</BaseButton>
      <VFinalModal v-model="showModal2" :lock-body-scroll="false" persistent>
        <BaseButton @click="showModal2 = false">close 2</BaseButton>
        <VFinalModal v-if="showModal3" v-model="showModal3" hide-overlay>
          <BaseButton @click="showModal3 = false">close 3</BaseButton>
        </VFinalModal>
        <BaseButton @click="showModal3 = true">Show third modal</BaseButton>
      </VFinalModal>
      <BaseButton @click="showModal2 = true">Show second modal</BaseButton>
    </VFinalModal>
    <BaseButton @click="showModal = true">Show default modal</BaseButton>
    <VFinalModal v-if="showModal4" v-model="showModal4" hide-overlay>
      <BaseButton @click="showModal4 = false">close 4</BaseButton>
    </VFinalModal>
    <BaseButton @click="showModal4 = true">Show forth modal</BaseButton>
    <div v-for="i in 100" :key="i">{{ i }}</div>
  </div>
</template>

<script>
import VFinalModal from '@/components/VFinalModal'
export default {
  components: {
    VFinalModal
  },
  data: () => ({
    showModal: false,
    showModal2: false,
    showModal3: false,
    showModal4: false
  })
}
</script>
