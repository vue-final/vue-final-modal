<template>
  <div class="modals-container">
    <component
      :is="modal.component"
      v-for="(modal, index) in api.dynamicModals"
      :key="modal.id"
      v-bind="modal.bind"
      v-model="modal.value"
      v-on="modal.on"
      @_beforeClose="beforeClose(modal)"
      @_closed="closed(index, modal)"
      @_beforeOpen="e => beforeOpen(e, modal, index)"
      @_opened="modal.opened"
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
  methods: {
    slice(index) {
      this.api.dynamicModals.splice(index, 1)
    },
    closed(index, modal) {
      this.slice(index)
      modal.closed && modal.closed()
    },
    beforeClose(modal) {
      if (modal.value) {
        modal?.rejectClose('hide')
      }
    },
    async beforeOpen(e, modal, index) {
      e.ref.params.value = modal.params
      await this.$nextTick()
      await this.$nextTick()
      if (!modal.value) {
        this.slice(index)
        modal?.reject('show')
      }
    },
    isString(val) {
      return typeof val === 'string'
    }
  }
}
</script>
