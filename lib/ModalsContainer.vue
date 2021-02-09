<template>
  <div class="modals-container">
    <component
      :is="modal.component"
      v-for="(modal, index) in api.dynamicModals"
      :key="modal.id"
      v-model="modal.value"
      v-bind="modal.bind"
      v-on="modal.on"
      @closed="slice(index)"
      @beforeOpen="e => beforeOpen(e, modal)"
    >
      <template v-for="(slot, key) in modal.slots" #[key] :key="key">
        <component :is="slot.component" v-bind="slot.bind" />
      </template>
    </component>
  </div>
</template>

<script>
export default {
  props: {},
  computed: {
    api() {
      return this[this.options.key]
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
