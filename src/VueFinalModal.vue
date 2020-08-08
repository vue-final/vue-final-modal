<template>
  <div v-if="visible" class="vfm">
    <transition
      :name="overlayTransition"
      @before-enter="beforeOverlayEnter"
      @after-enter="afterOverlayEnter"
      @before-leave="beforeOverlayLeave"
      @after-leave="afterOverlayLeave"
    >
      <div
        v-show="!hideOverlay && visibility.overlay"
        :style="{ zIndex }"
        class="vfm__overlay"
        :class="[
          { 'vfm__overlay--attach': attach !== 'body' },
          { 'vfm__overlay--prevent-click': preventClick },
          overlayClass
        ]"
      ></div>
    </transition>
    <transition
      :name="transition"
      @before-enter="beforeModalEnter"
      @after-enter="afterModalEnter"
      @before-leave="beforeModalLeave"
      @after-leave="afterModalLeave"
    >
      <div
        v-show="visibility.modal"
        :style="{ zIndex }"
        class="vfm__container"
        :class="[
          {
            'vfm__container--attach': attach !== 'body',
            'vfm__container--prevent-click': preventClick
          },
          classes
        ]"
        @click="clickToClose && $emit('input', false)"
      >
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
    </transition>
  </div>
</template>

<script>
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'

let modalStack = []

const TransitionState = {
  Enter: 'enter',
  Entering: 'entering',
  Leave: 'leave',
  Leaving: 'leavng'
}

export default {
  name: 'VueFinalModal',
  props: {
    value: { type: Boolean, default: false },
    classes: { type: [String, Object, Array], default: '' },
    contentClass: { type: [String, Object, Array], default: '' },
    lockScroll: { type: Boolean, default: true },
    hideOverlay: { type: Boolean, default: false },
    clickToClose: { type: Boolean, default: true },
    preventClick: { type: Boolean, default: false },
    overlayClass: { type: String, default: '' },
    attach: { type: null, default: 'body' },
    transition: { type: String, default: 'vfm' },
    overlayTransition: { type: String, default: 'vfm' },
    zIndex: { type: [String, Number], default: 1000 }
  },
  data: () => ({
    visible: false,
    visibility: {
      modal: false,
      overlay: false
    },
    overlayTransitionState: null,
    modalTransitionState: null
  }),
  computed: {
    isComponentReadyToBeDestroyed() {
      return (
        this.overlayTransitionState === TransitionState.Leave &&
        this.modalTransitionState === TransitionState.Leave
      )
    }
  },
  watch: {
    value(value) {
      this.mounted(value)
      if (value === false) {
        this.close()
      }
    },
    lockScroll: 'handleLockScroll',
    hideOverlay(value) {
      if (this.value) {
        !value && this.appendOverlay()
      }
    },
    attach() {
      this.mounted(this.value)
    },
    isComponentReadyToBeDestroyed(isReady) {
      if (isReady) {
        this.visible = false
      }
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
        let target = this.getAttachElement()
        if (target) {
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
                vm.visibility.overlay = false
              }
            })
        } else if (target !== false) {
          console.warn('Unable to locate target '.concat(this.attach || 'body'))
          return
        }
        this.$emit('before-open')
        this.visible = true
        this.$nextTick(() => {
          this.startTransitionEnter()
        })
      } else {
        this.lockScroll && clearAllBodyScrollLocks()
      }
    },
    close() {
      this.$emit('before-close')
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
      this.startTransitionLeave()
    },
    startTransitionEnter() {
      this.visibility.overlay = true
      this.visibility.modal = true
    },
    startTransitionLeave() {
      this.visibility.overlay = false
      this.visibility.modal = false
    },
    appendOverlay() {
      this.visibility.overlay = true
    },
    handleLockScroll() {
      this.lockScroll
        ? disableBodyScroll(this.$refs.vfmContent)
        : clearAllBodyScrollLocks()
    },
    getAttachElement() {
      let target
      if (this.attach === false) {
        target = false
      } else if (typeof this.attach === 'string') {
        // CSS selector
        target = document.querySelector(this.attach)
      } else {
        // DOM Element
        target = this.attach
      }
      return target
    },
    beforeOverlayEnter() {
      this.overlayTransitionState = TransitionState.Entering
    },
    afterOverlayEnter() {
      this.overlayTransitionState = TransitionState.Enter
    },
    beforeOverlayLeave() {
      this.overlayTransitionState = TransitionState.Leaving
    },
    afterOverlayLeave() {
      this.overlayTransitionState = TransitionState.Leave
    },
    beforeModalEnter() {
      this.modalTransitionState = TransitionState.Entering
    },
    afterModalEnter() {
      this.modalTransitionState = TransitionState.Enter
      this.$emit('opened')
    },
    beforeModalLeave() {
      this.modalTransitionState = TransitionState.Leaving
    },
    afterModalLeave() {
      this.modalTransitionState = TransitionState.Leave
      this.$emit('closed')
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
  z-index: 0;
}
.vfm-enter-active,
.vfm-leave-active {
  transition: opacity 0.2s;
}
.vfm-enter,
.vfm-leave-to {
  opacity: 0;
}
</style>
