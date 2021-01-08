<template>
  <div>
    <ModalsContainer></ModalsContainer>

    <button class="vfm-btn mb-4" @click="dynamic">Open Dynamic Modal</button>
    <button class="vfm-btn mb-4" @click="$vfm.hide('dynamicModal')">
      Close Dynamic Modal
    </button>
    <button class="vfm-btn mb-4" @click="$vfm.hideAll()">
      Hide All Modals
    </button>
  </div>
</template>

<script>
export default {
  methods: {
    dynamic() {
      this.$vfm.show({
        component: 'VModal',
        bind: {
          name: 'dynamicModal',
          preventClick: true
        }
      })
    }
  }
}
</script>
