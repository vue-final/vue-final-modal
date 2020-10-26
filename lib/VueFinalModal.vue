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
        :style="overlayStyle"
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
        ref="vfmContainer"
        class="vfm__container vfm--absolute vfm--inset vfm--outline-none"
        :class="[classes, { 'vfm--cursor-pointer': clickToClose }]"
        :style="styles"
        :aria-expanded="visibility.modal.toString()"
        role="dialog"
        aria-modal="true"
        @click="onClickContainer"
      >
        <div
          ref="vfmContent"
          class="vfm__content vfm--cursor-auto"
          :class="[contentClass, { 'vfm--prevent-auto': preventClick }]"
          :style="contentStyle"
          @click.stop
        >
          <slot />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import FocusTrap from './focusTrap.js'
import { setStyle, removeStyle } from './dom.js'

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

const STYLE_PROP = {
  type: [String, Object, Array],
  default: ''
}

export default {
  name: 'VueFinalModal',
  props: {
    name: { type: String, default: null },
    value: { type: Boolean, default: false },
    ssr: { type: Boolean, default: true },
    classes: STYLE_PROP,
    overlayClass: STYLE_PROP,
    contentClass: STYLE_PROP,
    styles: STYLE_PROP,
    overlayStyle: STYLE_PROP,
    contentStyle: STYLE_PROP,
    lockScroll: { type: Boolean, default: true },
    hideOverlay: { type: Boolean, default: false },
    clickToClose: { type: Boolean, default: true },
    preventClick: { type: Boolean, default: false },
    attach: { type: null, default: false, validator: validateAttachTarget },
    transition: { type: String, default: 'vfm' },
    overlayTransition: { type: String, default: 'vfm' },
    zIndexBase: { type: [String, Number], default: 1000 },
    zIndex: { type: [Boolean, String, Number], default: false },
    focusTrap: { type: Boolean, default: false }
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
  created() {
    this.$vfm.modals.push(this)
  },
  mounted() {
    this.$focusTrap = new FocusTrap()
    this.mounted()
  },
  beforeDestroy() {
    this.close()
    this.$el.remove()

    let index = this.$vfm.modals.findIndex(vm => vm === this)
    this.$vfm.openedModals.splice(index, 1)
  },
  methods: {
    mounted() {
      if (this.value) {
        let target = this.getAttachElement()
        if (target || this.attach === false) {
          this.attach !== false && target.appendChild(this.$el)
          let index = this.$vfm.openedModals.findIndex(vm => vm === this)
          if (index !== -1) {
            // if this is already exist in modalStack, delete it
            this.$vfm.openedModals.splice(index, 1)
          }
          this.$vfm.openedModals.push(this)

          this.modalStackIndex = this.$vfm.openedModals.length - 1

          this.handleLockScroll()
          this.$vfm.openedModals
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
      }
    },
    close() {
      let index = this.$vfm.openedModals.findIndex(vm => vm === this)
      if (index !== -1) {
        // remove this in modalStack
        this.$vfm.openedModals.splice(index, 1)
      }
      if (this.$vfm.openedModals.length > 0) {
        // If there are still nested modals opened
        const $_vm = this.$vfm.openedModals[this.$vfm.openedModals.length - 1]
        $_vm.handleLockScroll()
        $_vm.focusTrap && $_vm.$focusTrap.firstElement().focus()
        !$_vm.hideOverlay && ($_vm.visibility.overlay = true)
      } else {
        // If the closed modal is the last one
        this.lockScroll && removeStyle(document.body, 'overflow')
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
      if (this.value) {
        this.lockScroll
          ? setStyle(document.body, 'overflow', 'hidden')
          : removeStyle(document.body, 'overflow')
      }
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
      if (this.focusTrap) {
        this.$focusTrap.enable(this.$refs.vfmContainer)
      }
      this.$emit('opened')
    },
    beforeModalLeave() {
      this.$emit('before-close')
      this.modalTransitionState = TransitionState.Leaving

      if (this.$focusTrap.enabled()) {
        this.$focusTrap.disable()
      }
    },
    afterModalLeave() {
      this.modalTransitionState = TransitionState.Leave
      this.modalStackIndex = null
      this.$emit('closed')
    },
    onClickContainer() {
      this.$emit('click-outside')
      this.clickToClose && this.$emit('input', false)
    }
  }
}
</script>

<style lang="css" scoped>
.vfm--fixed {
  position: fixed;
}
.vfm--absolute {
  position: absolute;
}
.vfm--inset {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.vfm--overlay {
  background-color: rgba(0, 0, 0, 0.5);
}
.vfm--prevent-none {
  pointer-events: none;
}
.vfm--prevent-auto {
  pointer-events: auto;
}
.vfm--cursor-pointer {
  cursor: pointer;
}
.vfm--cursor-auto {
  cursor: auto;
}
.vfm--outline-none:focus {
  outline: none;
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
