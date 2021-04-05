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
      @opened="modal.opened"
    >
      <template v-for="(slot, key) in modal.slots" v-slot:[key]>
        <div v-if="isString(slot)" :key="key" v-html="slot"></div>
        <component v-else :key="key" :is="slot.component" v-bind="slot.bind" v-on="slot.on" />
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
    },
    isString(val) {
      return typeof val === 'string'
    }
  }
}
</script>
