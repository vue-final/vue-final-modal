<template>
  <div
    v-if="ssr || visible"
    v-show="!ssr || visible"
    :style="{ zIndex: calculateZIndex }"
    class="vfm vfm--inset"
    :class="[
      attach === false ? 'vfm--fixed' : 'vfm--absolute',
      { 'vfm--prevent-none': preventClick }
    ]"
  >
    <transition
      :name="overlayTransition"
      @before-enter="beforeOverlayEnter"
      @after-enter="afterOverlayEnter"
      @before-leave="beforeOverlayLeave"
      @after-leave="afterOverlayLeave"
    >
      <div
        v-show="!hideOverlay && visibility.overlay"
        class="vfm__overlay vfm--overlay vfm--absolute vfm--inset"
        :class="overlayClass"
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
        class="vfm__container vfm--absolute vfm--inset"
        :class="[classes, { 'vfm--cursor-pointer': clickToClose }]"
        @click="clickToClose && $emit('input', false)"
      >
        <slot name="content-before" />
        <slot name="content">
          <div
            ref="vfmContent"
            class="vfm__content vfm--cursor-auto"
            :class="[contentClass, { 'vfm--prevent-auto': preventClick }]"
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

function validateAttachTarget(val) {
  const type = typeof val

  if (type === 'boolean' || type === 'string') return true

  return val.nodeType === Node.ELEMENT_NODE
}

const CLASS_TYPES = [String, Object, Array]

export default {
  name: 'VueFinalModal',
  props: {
    value: { type: Boolean, default: false },
    ssr: { type: Boolean, default: true },
    classes: { type: CLASS_TYPES, default: '' },
    overlayClass: { type: CLASS_TYPES, default: '' },
    contentClass: { type: CLASS_TYPES, default: '' },
    lockScroll: { type: Boolean, default: true },
    hideOverlay: { type: Boolean, default: false },
    clickToClose: { type: Boolean, default: true },
    preventClick: { type: Boolean, default: false },
    attach: { type: null, default: false, validator: validateAttachTarget },
    transition: { type: String, default: 'vfm' },
    overlayTransition: { type: String, default: 'vfm' },
    zIndexBase: { type: [String, Number], default: 1000 },
    zIndex: { type: [Boolean, String, Number], default: false }
  },
  data: () => ({
    modalStackIndex: null,
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
        (this.hideOverlay ||
          this.overlayTransitionState === TransitionState.Leave) &&
        this.modalTransitionState === TransitionState.Leave
      )
    },
    calculateZIndex() {
      if (typeof this.zIndex === 'boolean') {
        if (this.attach) {
          return 'unset'
        } else {
          return this.zIndexBase + 2 * (this.modalStackIndex || 0)
        }
      } else {
        return this.zIndex
      }
    }
  },
  watch: {
    value(value) {
      this.mounted()
      if (!value) {
        this.close()
      }
    },
    lockScroll: 'handleLockScroll',
    hideOverlay(value) {
      if (this.value && !value) {
        this.visibility.overlay = true
      }
    },
    attach: 'mounted',
    isComponentReadyToBeDestroyed(isReady) {
      if (isReady) {
        this.visible = false
      }
    }
  },
  mounted() {
    this.mounted()
  },
  beforeDestroy() {
    this.close()
  },
  methods: {
    mounted() {
      if (this.value) {
        let target = this.getAttachElement()
        if (target || this.attach === false) {
          this.attach !== false && target.appendChild(this.$el)
          let index = modalStack.findIndex(vm => vm === this)
          if (index !== -1) {
            // if this is already exist in modalStack, delete it
            modalStack.splice(index, 1)
          }
          modalStack.push(this)

          this.modalStackIndex = modalStack.length - 1

          this.handleLockScroll()
          modalStack
            .filter(vm => vm !== this)
            .forEach((vm, index) => {
              if (vm.getAttachElement() === target) {
                // if vm and this have the same attach element
                vm.modalStackIndex = index
                vm.visibility.overlay = false
              }
            })

          this.visible = true
          this.$nextTick(() => {
            this.startTransitionEnter()
          })
        } else if (target !== false) {
          console.warn('Unable to locate target '.concat(this.attach))
        }
      } else {
        this.lockScroll && clearAllBodyScrollLocks()
      }
    },
    close() {
      let index = modalStack.findIndex(vm => vm === this)
      if (index !== -1) {
        // remove this in modalStack
        modalStack.splice(index, 1)
      }
      if (modalStack.length > 0) {
        // If there are still nested modals opened
        const $_vm = modalStack[modalStack.length - 1]
        $_vm.handleLockScroll()
        !$_vm.hideOverlay && ($_vm.visibility.overlay = true)
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
        if (window) {
          target = window.document.querySelector(this.attach)
        } else {
          target = false
        }
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
      this.$emit('before-open')
      this.modalTransitionState = TransitionState.Entering
    },
    afterModalEnter() {
      this.modalTransitionState = TransitionState.Enter
      this.$emit('opened')
    },
    beforeModalLeave() {
      this.$emit('before-close')
      this.modalTransitionState = TransitionState.Leaving
    },
    afterModalLeave() {
      this.modalTransitionState = TransitionState.Leave
      this.modalStackIndex = null
      this.$emit('closed')
    }
  }
}
</script>

<style lang="scss" scoped>
.vfm {
  &--fixed {
    position: fixed;
  }
  &--absolute {
    position: absolute;
  }
  &--inset {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  &--overlay {
    background-color: rgba(0, 0, 0, 0.5);
  }
  &--prevent-none {
    pointer-events: none;
  }
  &--prevent-auto {
    pointer-events: auto;
  }
  &--cursor-pointer {
    cursor: pointer;
  }
  &--cursor-auto {
    cursor: auto;
  }
  &-enter-active,
  &-leave-active {
    transition: opacity 0.2s;
  }
  &-enter,
  &-leave-to {
    opacity: 0;
  }
}
</style>
