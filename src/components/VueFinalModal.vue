<template>
  <div
    v-show="value"
    :class="classes"
    @click="clickToClose && $emit('input', false)"
  >
    <div :class="contentClasses" @click.stop>
      <slot />
    </div>
  </div>
</template>

<script>
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'

let modalStack = []
let overlay = (() => {
  let overlay = document.createElement('div')
  overlay.className = 'vfm--overlay'
  return overlay
})()

export default {
  name: 'TModal',
  props: {
    value: { type: Boolean, default: false },
    lockScroll: { type: Boolean, default: true },
    hideOverlay: { type: Boolean, default: false },
    clickToClose: { type: Boolean, default: true },
    contentClass: { type: String, default: '' }
  },
  computed: {
    classes() {
      return {
        'vfm--container': true
      }
    },
    contentClasses() {
      return `vfm--box ${this.contentClass}`.trim()
    }
  },
  watch: {
    value: 'init',
    lockScroll: 'handleLockScroll'
  },
  created() {
    setTimeout(() => {
      this.mounted(this.value)
    })
  },
  beforeDestroy() {
    this.lockBodyScroll && enableBodyScroll()
  },
  destroyed() {
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
    this.close()
  },
  methods: {
    init(value) {
      if (value) {
        document.body.appendChild(this.$el)
        modalStack.push(this)
        this.handleLockScroll()
        this.hideOverlay ? this.removeOverlay() : this.appendOverlay()
      } else {
        this.lockScroll && enableBodyScroll()
        this.close()
      }
    },
    mounted(value) {
      if (value) {
        document.body.appendChild(this.$el)
        modalStack.push(this)
        this.handleLockScroll()
        this.hideOverlay ? this.removeOverlay() : this.appendOverlay()
      } else {
        this.lockScroll && enableBodyScroll()
      }
    },
    close() {
      modalStack.pop()
      if (modalStack.length > 0) {
        const $_vm = modalStack[modalStack.length - 1]
        $_vm.handleLockScroll()
        $_vm.hideOverlay ? $_vm.removeOverlay() : $_vm.appendOverlay()
      } else {
        !this.hideOverlay && this.removeOverlay()
        this.lockScroll && enableBodyScroll()
      }
      this.$emit('input', false)
    },
    appendOverlay() {
      this.$el && this.$el.before(overlay, this.$el)
    },
    removeOverlay() {
      overlay && overlay.parentNode && overlay.parentNode.removeChild(overlay)
    },
    handleLockScroll() {
      this.lockScroll ? disableBodyScroll() : enableBodyScroll()
    }
  }
}
</script>

<style>
.vfm--overlay {
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
}
</style>

<style lang="scss" scoped>
.vfm--container {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
.vfm--box {
  max-height: 90%;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  overflow: auto;
}
</style>
