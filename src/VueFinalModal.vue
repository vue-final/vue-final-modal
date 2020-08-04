<template>
  <div
    v-show="value"
    class="vfm__container"
    :class="{
      'vfm__container--attach': attach !== 'body',
      'vfm__container--prevent-click': preventClick
    }"
    @click="clickToClose && $emit('input', false)"
  >
    <div
      v-if="!hideOverlay && $data._showOverlay"
      ref="vfmOverlay"
      class="vfm__overlay"
      :class="[
        { 'vfm__overlay--attach': attach !== 'body' },
        { 'vfm__overlay--prevent-click': preventClick },
        overlayClass
      ]"
    ></div>
    <slot name="content-before" />
    <slot name="content">
      <div
        ref="vfmContent"
        class="vfm__content"
        :class="contentClass"
        @click.stop
      >
        <slot />
      </div>
    </slot>
    <slot name="content-after" />
  </div>
</template>

<script>
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'

let modalStack = []

export default {
  name: 'VueFinalModal',
  props: {
    value: { type: Boolean, default: false },
    contentClass: { type: [String, Object, Array], default: '' },
    lockScroll: { type: Boolean, default: true },
    hideOverlay: { type: Boolean, default: false },
    clickToClose: { type: Boolean, default: true },
    preventClick: { type: Boolean, default: false },
    overlayClass: { type: String, default: '' },
    attach: { type: null, default: 'body' }
  },
  data: () => ({
    _showOverlay: true
  }),
  watch: {
    value(value) {
      this.mounted(value)
      !value && this.close()
    },
    lockScroll: 'handleLockScroll',
    hideOverlay(value) {
      if (this.value) {
        !value && this.appendOverlay()
      }
    },
    attach() {
      this.mounted(this.value)
    }
  },
  created() {
    setTimeout(() => {
      this.mounted(this.value)
    })
  },
  beforeDestroy() {
    this.close()
  },
  methods: {
    mounted(value) {
      if (value) {
        if (this.attach === false) {
          !this.hideOverlay && this.appendOverlay()
          return
        }
        let target = this.getAttachElement()
        if (!target) {
          console.warn('Unable to locate target '.concat(this.attach || 'body'))
          return
        }
        target.appendChild(this.$el)
        let index = modalStack.findIndex(vm => vm === this)
        if (index !== -1) {
          // if this is already exist in modalStack, delete it
          modalStack.splice(index, 1)
        }
        modalStack.push(this)
        this.handleLockScroll()
        modalStack
          .filter(vm => vm !== this)
          .forEach(vm => {
            if (vm.getAttachElement() === target) {
              // if vm and this have the same attach element
              vm.$data._showOverlay = false
            }
          })
        !this.hideOverlay && this.appendOverlay()
      } else {
        this.lockScroll && clearAllBodyScrollLocks()
      }
    },
    close() {
      this.$emit('closed')
      let index = modalStack.findIndex(vm => vm === this)
      if (index !== -1) {
        // remove this in modalStack
        modalStack.splice(index, 1)
      }
      if (modalStack.length > 0) {
        // If there are still nested modals opened
        const $_vm = modalStack[modalStack.length - 1]
        $_vm.handleLockScroll()
        !$_vm.hideOverlay && $_vm.appendOverlay()
      } else {
        // If the closed modal is the last one
        this.lockScroll && clearAllBodyScrollLocks()
      }
      this.$data._showOverlay = false

      if (this.$refs.vfmOverlay) {
        this.$refs.vfmOverlay.remove()
      }
    },
    appendOverlay() {
      this.$data._showOverlay = true
      this.$nextTick().then(() => {
        this.$el && this.$el.before(this.$refs.vfmOverlay, this.$el)
      })
    },
    handleLockScroll() {
      this.lockScroll
        ? disableBodyScroll(this.$refs.vfmContent)
        : clearAllBodyScrollLocks()
    },
    getAttachElement() {
      let target
      if (this.attach === false) {
        target = null
      } else if (typeof this.attach === 'string') {
        // CSS selector
        target = document.querySelector(this.attach)
      } else {
        // DOM Element
        target = this.attach
      }
      return target
    }
  }
}
</script>

<style lang="scss" scoped>
.vfm__overlay {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000;
  opacity: 0.5;
  &--attach {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  &--prevent-click {
    pointer-events: none;
  }
}

.vfm__container {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  &--attach {
    position: absolute;
  }
  &--prevent-click {
    pointer-events: none;
    .vfm__content {
      pointer-events: auto;
    }
  }
}
.vfm__content {
  display: inline-block;
}
</style>
