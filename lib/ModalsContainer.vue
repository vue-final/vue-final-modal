<template>
  <div class="modals-container">
    <component
      v-for="(modal, index) in api.dynamicModals"
      :key="modal.id"
      :is="modal.component"
      v-model="modal.value"
      v-bind="modal.bind"
      v-on="modal.on"
      @closed="slice(index)"
      @before-open="e => beforeOpen(e, modal)"
    >
      <template v-for="(slot, key) in modal.slots" v-slot:[key]>
        <component :key="key" :is="slot.component" v-bind="slot.bind" @close="modal.value = false" />
      </template>
    </component>
  </div>
</template>

<script>
export default {
  props: {},
  computed: {
    api() {
      return this[this.$_options.key]
    }
  },
  methods: {
    slice(index) {
      this.api.dynamicModals.splice(index, 1)
    },
    beforeOpen(e, modal) {
      e.ref.params = modal.params
    }
  }
}
</script>
