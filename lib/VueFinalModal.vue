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
        <div ref="vfmWrapper" class="vfm__wrapper" :style="wrapperStyle" @click.self="onClickContainer">
          <div
            ref="vfmContent"
            class="vfm__content"
            :class="[contentClass, { 'vfm--prevent-auto': preventClick }]"
            :style="bindContentStyle"
          >
            <slot v-bind:params="params" />
          </div>
        </div>
      </div>
    </transition>
    <div
      v-if="visibility.resize && visibility.modal"
      ref="vfmResize"
      class="vfm__resize vfm--fixed vfm--prevent-none vfm--select-none"
      :style="resizeStyle"
    >
      <div
        v-for="direction in resizeDirections"
        :key="direction"
        :direction="direction"
        :class="`vfm--resize-${direction}`"
        class="vfm--absolute vfm--prevent-auto"
      ></div>
    </div>
  </div>
</template>

<script>
import FocusTrap from './utils/focusTrap.js'
import {
  setStyle,
  getPosition,
  clamp,
  trimPx,
  validDragElement,
  getLimit,
  getWrapperStyle,
  addEventListener,
  removeEventListener,
  addPointerMoving
} from './utils/dragResize.js'
import { disableBodyScroll, enableBodyScroll } from './utils/bodyScrollLock'

const noop = () => {}

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

const resizeCursor = {
  t: 'ns-resize',
  tr: 'nesw-resize',
  r: 'ew-resize',
  br: 'nwse-resize',
  b: 'ns-resize',
  bl: 'nesw-resize',
  l: 'ew-resize',
  tl: 'nwse-resize'
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
    contentStyle: { type: [Object, Array], default: () => ({}) },
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
    focusTrap: { type: Boolean, default: false },
    drag: { type: Boolean, default: false },
    fitParent: { type: Boolean, default: true },
    dragSelector: { type: [Boolean, String], default: false },
    keepChangedStyle: { type: Boolean, default: false },
    resizeDirections: {
      type: Array,
      default: () => [],
      validator: val =>
        ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl'].filter(value => val.indexOf(value) !== -1).length === val.length
    }
  },
  data: () => ({
    modalStackIndex: null,
    visible: false,
    visibility: {
      modal: false,
      overlay: false,
      resize: false
    },
    overlayTransitionState: null,
    modalTransitionState: null,
    stopEvent: false,
    params: {},
    wrapperStyle: {},
    resizeStyle: {},
    resizeContentStyle: {},
    resolveToggle: noop,
    rejectToggle: noop
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
    bindContentStyle() {
      let style = [this.resizeContentStyle]
      Array.isArray(this.contentStyle) ? style.push(...this.contentStyle) : style.push(this.contentStyle)
      return style
    },
    computedTransition() {
      if (typeof this.transition === 'string') return { name: this.transition }
      return { ...this.transition }
    },
    computedOverlayTransition() {
      if (typeof this.overlayTransition === 'string') return { name: this.overlayTransition }
      return { ...this.overlayTransition }
    },
    resize() {
      return this.resizeDirections.length > 0
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
          this.rejectToggle('hide')
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
    },
    drag(value) {
      if (this.visible) {
        value ? this.addDragDown() : this.removeDragDown()
      }
    },
    resize(value) {
      if (this.visible) {
        value ? this.addResizeDown() : this.removeResizeDown()
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
          this.rejectToggle('show')
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
      this.drag && this.removeDragDown()
      this.resize && this.removeResizeDown()

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
      this.focusTrap && this.$focusTrap.enable(this.$refs.vfmContainer)
      this.drag && this.addDragDown()
      this.resize && this.addResizeDown()

      this.$emit('opened', this.createModalEvent({ type: 'opened' }))
      this.resolveToggle('show')
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
      if (!this.keepChangedStyle) {
        this.wrapperStyle = {}
        this.resizeContentStyle = {}
      }

      let stopEvent = false
      const event = this.createModalEvent({
        type: 'closed',
        stop() {
          stopEvent = true
        }
      })
      this.$emit('closed', event)
      this.resolveToggle('hide')
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
      return new Promise((resolve, reject) => {
        this.resolveToggle = res => {
          resolve(res)
          this.resolveToggle = noop
        }
        this.rejectToggle = err => {
          reject(err)
          this.rejectToggle = noop
        }
        const value = typeof show === 'boolean' ? show : !this.value
        if (value && arguments.length === 2) {
          this.params = params
        }
        this.$emit('input', value)
      })
    },
    pointerDown(e) {
      e.stopPropagation()
      const { vfmContainer, vfmWrapper, vfmContent } = this.$refs
      const direction = e.target.getAttribute('direction')
      let state
      if (direction) {
        state = 'resize'
      } else if (validDragElement(e, vfmContent, this.dragSelector)) {
        state = 'drag'
      } else {
        return
      }
      this.$emit(`${state}:start`, e)
      const down = getPosition(e)
      const limit = this.fitParent && getLimit(vfmContainer, vfmWrapper, vfmContent)
      const wrapperPosition = {
        top: trimPx(vfmWrapper.style.top),
        left: trimPx(vfmWrapper.style.left)
      }
      let { position, width, height } = window.getComputedStyle(vfmContent)
      width = trimPx(width)
      height = trimPx(height)
      const vfmContentAbsolute = position === 'absolute'
      const resetBodyCursor = state === 'resize' && setStyle(document.body, 'cursor', resizeCursor[direction])
      addPointerMoving(
        e => {
          this.$emit(`${state}:move`, e)
          e.stopPropagation()
          const move = getPosition(e)
          let offset = {
            x: move.x - down.x,
            y: move.y - down.y
          }
          if (state === 'resize') {
            offset = this.getResizeOffset(direction, offset, limit.rectContainer, limit.rectContent, vfmContentAbsolute)
            offset.width && (this.resizeContentStyle.width = width - offset.width + 'px')
            offset.height && (this.resizeContentStyle.height = height - offset.height + 'px')
          }
          this.wrapperStyle = getWrapperStyle(wrapperPosition, offset, this.fitParent, limit, vfmContentAbsolute)
        },
        e => {
          if (this.resize) {
            this.resetResizeStyle()
          }
          if (state === 'resize') {
            resetBodyCursor && resetBodyCursor()
          }
          this.$emit(`${state}:end`, e)
        }
      )
    },
    addDragDown() {
      addEventListener('down', this.$refs.vfmContent, this.pointerDown)
      this.wrapperStyle.touchAction = 'none'
    },
    removeDragDown() {
      removeEventListener('down', this.$refs.vfmContent, this.pointerDown)
    },
    addResizeDown() {
      this.resetResizeStyle()
      window.addEventListener('resize', this.resetResizeStyle)
      this.visibility.resize = true
      this.$nextTick(() => {
        addEventListener('down', this.$refs.vfmResize, this.pointerDown)
      })
    },
    removeResizeDown() {
      window.removeEventListener('resize', this.resetResizeStyle)
      removeEventListener('down', this.$refs.vfmResize, this.pointerDown)
      this.visibility.resize = false
    },
    resetResizeStyle() {
      const { width, height, top, left } = this.$refs.vfmContent.getBoundingClientRect()
      this.resizeStyle = {
        top: top + 'px',
        left: left + 'px',
        width: width + 'px',
        height: height + 'px',
        touchAction: 'none'
      }
    },
    getResizeOffset(direction, offset, rectContainer, rectContent, vfmContentAbsolute) {
      const _offset = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      }
      const set = {
        t: () => {
          const y = this.fitParent ? clamp(rectContainer.top - rectContent.top, offset.y, rectContent.height) : offset.y
          _offset.y = vfmContentAbsolute ? y : y / 2
          _offset.height = y
        },
        b: () => {
          const y = this.fitParent
            ? clamp(-rectContent.height, offset.y, rectContainer.bottom - rectContent.bottom)
            : offset.y
          _offset.y = vfmContentAbsolute ? 0 : y / 2
          _offset.height = -y
        },
        l: () => {
          const x = this.fitParent
            ? clamp(rectContainer.left - rectContent.left, offset.x, rectContent.width)
            : offset.x
          _offset.x = x / 2
          _offset.width = x
        },
        r: () => {
          const x = this.fitParent
            ? clamp(-rectContent.width, offset.x, rectContainer.right - rectContent.right)
            : offset.x
          _offset.x = x / 2
          _offset.width = -x
        },
        tl() {
          set.t()
          set.l()
        },
        tr() {
          set.t()
          set.r()
        },
        br() {
          set.b()
          set.r()
        },
        bl() {
          set.b()
          set.l()
        }
      }
      set[direction]()
      return _offset
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

.vfm--select-none {
  user-select: none;
}

.vfm--resize-tr,
.vfm--resize-br,
.vfm--resize-bl,
.vfm--resize-tl {
  width: 12px;
  height: 12px;
  z-index: 10;
}

.vfm--resize-t {
  top: -6px;
  left: 0;
  width: 100%;
  height: 12px;
  cursor: ns-resize;
}
.vfm--resize-tr {
  top: -6px;
  right: -6px;
  cursor: nesw-resize;
}
.vfm--resize-r {
  top: 0;
  right: -6px;
  width: 12px;
  height: 100%;
  cursor: ew-resize;
}
.vfm--resize-br {
  bottom: -6px;
  right: -6px;
  cursor: nwse-resize;
}
.vfm--resize-b {
  bottom: -6px;
  left: 0;
  width: 100%;
  height: 12px;
  cursor: ns-resize;
}
.vfm--resize-bl {
  bottom: -6px;
  left: -6px;
  cursor: nesw-resize;
}
.vfm--resize-l {
  top: 0;
  left: -6px;
  width: 12px;
  height: 100%;
  cursor: ew-resize;
}
.vfm--resize-tl {
  top: -6px;
  left: -6px;
  cursor: nwse-resize;
}
</style>
