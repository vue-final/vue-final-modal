<template>
  <div class="modals-container">
    <component
      :is="modal.component"
      v-for="(modal, index) in api.dynamicModals"
      :key="modal.id"
      v-bind="modal.bind"
      v-model="modal.value"
      v-on="modal.on"
      @closed="slice(index)"
      @beforeOpen="e => beforeOpen(e, modal)"
    >
      <template v-for="(slot, key) in modal.slots" #[key] :key="key">
        <!-- eslint-disable vue/no-v-html -->
        <div v-if="isString(slot)" v-html="slot"></div>
        <component :is="slot.component" v-else v-bind="slot.bind" v-on="slot.on || {}" />
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
      e.ref.params.value = modal.params
    },
    isString(val) {
      return typeof val === 'string'
    }
  }
}
</script>
