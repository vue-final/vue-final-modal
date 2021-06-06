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
      @before-open="e => beforeOpen(e, modal, index)"
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
  methods: {
    slice(index) {
      this.api.dynamicModals.splice(index, 1)
    },
    beforeOpen(e, modal, index) {
      e.ref.params = modal.params
      this.$nextTick(() => {
        if (!modal.value) {
          this.slice(index)
          modal.reject('show')
        }
      })
    },
    isString(val) {
      return typeof val === 'string'
    }
  }
}
</script>
