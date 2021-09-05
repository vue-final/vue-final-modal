<template>
  <v-button class="mb-4" highlight @click="dynamic">Open Dynamic Modal</v-button>
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
