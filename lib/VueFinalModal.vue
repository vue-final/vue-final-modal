<template>
  <div
    v-if="ssr || visible"
    v-show="!ssr || visible"
    :style="bindStyle"
    class="vfm vfm--inset"
    :class="[attach === false ? 'vfm--fixed' : 'vfm--absolute', { 'vfm--prevent-none': preventClick }]"
    @keydown.esc="onEsc"
  >
    <transition
      ref="vfmOverlayTransition"
      v-bind="computedOverlayTransition"
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
      ref="vfmTransition"
      v-bind="computedTransition"
      @before-enter="beforeModalEnter"
      @after-enter="afterModalEnter"
      @before-leave="beforeModalLeave"
      @after-leave="afterModalLeave"
    >
      <div
        v-show="visibility.modal"
        ref="vfmContainer"
        class="vfm__container vfm--absolute vfm--inset vfm--outline-none"
        :class="classes"
        :style="styles"
        :aria-expanded="visibility.modal.toString()"
        role="dialog"
        aria-modal="true"
        tabindex="-1"
        @click.self="onClickContainer"
      >
        <div class="vfm__content" :class="[contentClass, { 'vfm--prevent-auto': preventClick }]" :style="contentStyle">
          <slot v-bind:params="params" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import FocusTrap from './utils/focusTrap.js'
import { disableBodyScroll, enableBodyScroll } from './utils/bodyScrollLock'

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
    escToClose: { type: Boolean, default: false },
    preventClick: { type: Boolean, default: false },
    attach: { type: null, default: false, validator: validateAttachTarget },
    transition: { type: [String, Object], default: 'vfm' },
    overlayTransition: { type: [String, Object], default: 'vfm' },
    zIndexAuto: { type: Boolean, default: true },
    zIndexBase: { type: [String, Number], default: 1000 },
    zIndex: { type: [Boolean, String, Number], default: false },
    focusRetain: { type: Boolean, default: true },
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
    modalTransitionState: null,
    stopEvent: false,
    params: {}
  }),
  computed: {
    api() {
      return this[this.$_options.key]
    },
    isComponentReadyToBeDestroyed() {
      return (
        (this.hideOverlay || this.overlayTransitionState === TransitionState.Leave) &&
        this.modalTransitionState === TransitionState.Leave
      )
    },
    calculateZIndex() {
      if (this.zIndex === false) {
        if (this.zIndexAuto) {
          return +this.zIndexBase + 2 * (this.modalStackIndex || 0)
        } else {
          return false
        }
      } else {
        return this.zIndex
      }
    },
    bindStyle() {
      return {
        ...(this.calculateZIndex !== false && { zIndex: this.calculateZIndex })
      }
    },
    computedTransition() {
      if (typeof this.transition === 'string') return { name: this.transition }
      return { ...this.transition }
    },
    computedOverlayTransition() {
      if (typeof this.overlayTransition === 'string') return { name: this.overlayTransition }
      return { ...this.overlayTransition }
    }
  },
  watch: {
    value(value) {
      if (this.stopEvent) {
        this.stopEvent = false
        return
      }
      this.mounted()
      if (!value) {
        if (this.emitEvent('before-close', true)) {
          return
        }
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
    this.api.modals.push(this)
  },
  mounted() {
    this.$focusTrap = new FocusTrap()
    this.mounted()
  },
  beforeDestroy() {
    this.close()
    this.lockScroll && this.$refs.vfmContainer && enableBodyScroll(this.$refs.vfmContainer)
    this?.$el?.remove()

    let index = this.api.modals.findIndex(vm => vm === this)
    this.api.modals.splice(index, 1)
  },
  methods: {
    mounted() {
      if (this.value) {
        if (this.emitEvent('before-open', false)) {
          return
        }
        let target = this.getAttachElement()
        if (target || this.attach === false) {
          this.attach !== false && target.appendChild(this.$el)

          let index = this.api.openedModals.findIndex(vm => vm === this)
          if (index !== -1) {
            // if this is already exist in modalStack, delete it
            this.api.openedModals.splice(index, 1)
          }
          this.api.openedModals.push(this)

          this.modalStackIndex = this.api.openedModals.length - 1

          this.handleLockScroll()
          this.api.openedModals
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
      let index = this.api.openedModals.findIndex(vm => vm === this)
      if (index !== -1) {
        // remove this in modalStack
        this.api.openedModals.splice(index, 1)
      }
      if (this.api.openedModals.length > 0) {
        // If there are still nested modals opened
        const $_vm = this.api.openedModals[this.api.openedModals.length - 1]
        if ($_vm.focusRetain || $_vm.focusTrap) {
          $_vm.$refs.vfmContainer.focus()
        }
        !$_vm.hideOverlay && ($_vm.visibility.overlay = true)
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
        this.$nextTick(() => {
          if (this.lockScroll) {
            disableBodyScroll(this.$refs.vfmContainer, {
              reserveScrollBarGap: true
            })
          } else {
            enableBodyScroll(this.$refs.vfmContainer)
          }
        })
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
      this.modalTransitionState = TransitionState.Entering
    },
    afterModalEnter() {
      this.modalTransitionState = TransitionState.Enter
      if (this.focusRetain || this.focusTrap) {
        this.$refs.vfmContainer.focus()
      }
      if (this.focusTrap) {
        this.$focusTrap.enable(this.$refs.vfmContainer)
      }
      this.$emit('opened', this.createModalEvent({ type: 'opened' }))
    },
    beforeModalLeave() {
      this.modalTransitionState = TransitionState.Leaving

      if (this.$focusTrap.enabled()) {
        this.$focusTrap.disable()
      }
    },
    afterModalLeave() {
      this.modalTransitionState = TransitionState.Leave
      this.modalStackIndex = null
      this.lockScroll && enableBodyScroll(this.$refs.vfmContainer)

      let stopEvent = false
      const event = this.createModalEvent({
        type: 'closed',
        stop() {
          stopEvent = true
        }
      })
      this.$emit('closed', event)
      if (stopEvent) return
      this.params = {}
    },
    onClickContainer() {
      this.$emit('click-outside', this.createModalEvent({ type: 'click-outside' }))
      this.clickToClose && this.$emit('input', false)
    },
    onEsc() {
      if (this.visible && this.escToClose) {
        this.$emit('input', false)
      }
    },
    createModalEvent(eventProps = {}) {
      return {
        ref: this,
        ...eventProps
      }
    },
    emitEvent(eventType, value) {
      let stopEvent = false
      const event = this.createModalEvent({
        type: eventType,
        stop() {
          stopEvent = true
        }
      })
      this.$emit(eventType, event)
      if (stopEvent) {
        this.stopEvent = true
        this.$emit('input', value)
        return true
      }
      return false
    },
    toggle(show, params) {
      const value = typeof show === 'boolean' ? show : !this.value
      if (value && arguments.length === 2) {
        this.params = params
      }
      this.$emit('input', value)
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
