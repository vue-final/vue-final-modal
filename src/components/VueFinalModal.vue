<template>
  <div
    v-show="value"
    class="vfm__container"
    :class="{ 'vfm__container--attach': attach }"
    @click="clickToClose && $emit('input', false)"
  >
    <slot name="box-before" />
    <slot name="box">
      <div ref="vfmBox" class="vfm__box" :class="boxClass" @click.stop>
        <slot />
      </div>
    </slot>
    <slot name="box-after" />
  </div>
</template>

<script>
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'

let modalStack = []
let overlay = (() => {
  let overlay = document.createElement('div')
  return overlay
})()

export default {
  name: 'VueFinalModal',
  props: {
    value: { type: Boolean, default: false },
    lockScroll: { type: Boolean, default: true },
    hideOverlay: { type: Boolean, default: false },
    clickToClose: { type: Boolean, default: true },
    boxClass: { type: [String, Object, Array], default: '' },
    overlayClass: { type: String, default: '' },
    attach: { type: null, default: false }
  },
  watch: {
    value: 'init',
    lockScroll: 'handleLockScroll',
    attach() {
      this.mounted(this.value)
    }
  },
  created() {
    setTimeout(() => {
      this.mounted(this.value)
    })
  },
  destroyed() {
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
    this.close()
  },
  methods: {
    init(value) {
      this.mounted(value)
      !value && this.close()
    },
    mounted(value) {
      if (value) {
        this.getAttachElement().appendChild(this.$el)
        let index = modalStack.findIndex(vm => vm === this)
        if (index !== -1) {
          modalStack.slice(index, 1, this)
        } else {
          modalStack.push(this)
        }
        this.handleLockScroll()
        this.hideOverlay ? this.removeOverlay() : this.appendOverlay()
      } else {
        this.lockScroll && clearAllBodyScrollLocks()
      }
    },
    close() {
      modalStack.pop()
      if (modalStack.length > 0) {
        const $_vm = modalStack[modalStack.length - 1]
        $_vm.handleLockScroll()
        $_vm.hideOverlay ? $_vm.removeOverlay() : $_vm.appendOverlay()
      } else {
        this.removeOverlay()
        this.lockScroll && clearAllBodyScrollLocks()
      }
      this.$emit('input', false)
    },
    appendOverlay() {
      overlay.className = `vfm__overlay${
        this.attach ? ' vfm__overlay--attach' : ''
      }`
      this.overlayClass && overlay.classList.add(this.overlayClass)
      this.$el && this.$el.before(overlay, this.$el)
    },
    removeOverlay() {
      overlay && overlay.parentNode && overlay.parentNode.removeChild(overlay)
    },
    handleLockScroll() {
      this.lockScroll
        ? disableBodyScroll(this.$refs.vfmBox)
        : clearAllBodyScrollLocks()
    },
    getAttachElement() {
      let target
      if (this.attach === false) {
        // Default, detach to app
        target = document.body
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

<style lang="scss">
.vfm__overlay {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #212121;
  opacity: 0.46;
  &--attach {
    position: absolute;
    width: 100%;
    height: 100%;
  }
}
</style>

<style lang="scss" scoped>
.vfm__container {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  &--attach {
    position: absolute;
  }
}
.vfm__box {
  display: inline-block;
}
</style>
