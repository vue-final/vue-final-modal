<template>
  <button class="vfm-btn mb-4" @click="dynamic">Open Dynamic Modal</button>
</template>

<script>
export default {
  methods: {
    dynamic() {
      this.$vfm.show({
        component: 'VDynamicModal'
      })
    }
  }
}
</script>
