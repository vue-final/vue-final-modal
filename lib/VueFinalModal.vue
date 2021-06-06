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
        @mouseup.self="onMouseupContainer"
        @mousedown.self="onMousedown"
      >
        <div
          ref="vfmContent"
          class="vfm__content"
          :class="[contentClass, { 'vfm--prevent-auto': preventClick }]"
          :style="bindContentStyle"
          @mousedown="onMousedown(null)"
        >
          <slot :params="params" :close="() => $emit('input', false)" />
          <div
            v-if="visibility.resize && visibility.modal"
            ref="vfmResize"
            class="vfm__resize vfm--absolute vfm--inset vfm--prevent-none vfm--select-none vfm--touch-none"
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
      </div>
    </transition>
  </div>
</template>

<script>
import FocusTrap from './utils/focusTrap.js'
import {
  setStyle,
  getPosition,
  capitalize,
  clamp,
  trimPx,
  validDragElement,
  addListener,
  removeListener
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

const CLASS_PROP = {
  type: [String, Object, Array],
  default: ''
}

const STYLE_PROP = {
  type: [Object, Array],
  default: () => ({})
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
    classes: CLASS_PROP,
    overlayClass: CLASS_PROP,
    contentClass: CLASS_PROP,
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
    focusTrap: { type: Boolean, default: false },
    fitParent: { type: Boolean, default: true },
    drag: { type: Boolean, default: false },
    dragSelector: { type: String, default: '' },
    keepChangedStyle: { type: Boolean, default: false },
    resize: {
      type: Boolean,
      default: false
    },
    resizeDirections: {
      type: Array,
      default: () => ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl'],
      validator: val =>
        ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl'].filter(value => val.indexOf(value) !== -1).length === val.length
    },
    minWidth: { type: Number, default: 0 },
    minHeight: { type: Number, default: 0 },
    maxWidth: { type: Number, default: Infinity },
    maxHeight: { type: Number, default: Infinity }
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
    dragResizeStyle: {},
    resolveToggle: noop,
    rejectToggle: noop,
    state: null,
    lastMousedownEl: null
  }),
  computed: {
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
      let style = [this.dragResizeStyle]
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
    },
    keepChangedStyle(value) {
      if (!value) {
        this.dragResizeStyle = {}
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
      this.state = null

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
        this.dragResizeStyle = {}
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
    onMousedown(e) {
      this.lastMousedownEl = e?.target
    },
    onMouseupContainer() {
      // skip when the lastMousedownEl didn't equal $refs.vfmContainer
      if (this.lastMousedownEl !== this.$refs.vfmContainer) return
      // skip when state equal 'resize:move'
      if (this.state === 'resize:move') return
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
    emitState(e, state, action) {
      this.state = `${state}:${action}`
      this.$emit(this.state, e)
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
      const STATE_RESIZE = 'resize'
      const STATE_DRAG = 'drag'
      const { vfmContainer, vfmContent } = this.$refs
      const direction = e.target.getAttribute('direction')
      let state
      if (direction) {
        state = STATE_RESIZE
      } else if (validDragElement(e, vfmContent, this.dragSelector)) {
        state = STATE_DRAG
      } else {
        return
      }
      this.emitState(e, state, 'start')
      const down = getPosition(e)
      const rectContainer = vfmContainer.getBoundingClientRect()
      const rectContent = vfmContent.getBoundingClientRect()
      const isAbsolute = window.getComputedStyle(vfmContent).position === 'absolute'
      const position = {
        top: trimPx(this.dragResizeStyle.top),
        left: trimPx(this.dragResizeStyle.left)
      }
      const limit = (() => {
        if (this.fitParent) {
          const limit = {
            absolute() {
              return {
                minTop: 0,
                minLeft: 0,
                maxTop: rectContainer.height - rectContent.height,
                maxLeft: rectContainer.width - rectContent.width
              }
            },
            relative() {
              return {
                minTop: position.top + rectContainer.top - rectContent.top,
                minLeft: position.left + rectContainer.left - rectContent.left,
                maxTop: position.top + rectContainer.bottom - rectContent.bottom,
                maxLeft: position.left + rectContainer.right - rectContent.right
              }
            }
          }
          return isAbsolute ? limit.absolute() : limit.relative()
        } else {
          return {}
        }
      })()
      const resetBodyCursor = state === STATE_RESIZE && setStyle(document.body, 'cursor', resizeCursor[direction])

      const moving = e => {
        // onPointerMove
        e.stopPropagation()
        this.emitState(e, state, 'move')
        const move = getPosition(e)
        let offset = {
          x: move.x - down.x,
          y: move.y - down.y
        }
        if (state === STATE_RESIZE) {
          offset = this.getResizeOffset(direction, offset, rectContainer, rectContent, isAbsolute)
        }

        let top
        let left
        if (isAbsolute) {
          top = rectContent.top - rectContainer.top + offset.y
          left = rectContent.left - rectContainer.left + offset.x
        } else {
          top = position.top + offset.y
          left = position.left + offset.x
        }
        if (state === STATE_DRAG && this.fitParent) {
          top = clamp(limit.minTop, top, limit.maxTop)
          left = clamp(limit.minLeft, left, limit.maxLeft)
        }
        const style = {
          position: 'relative',
          top: top + 'px',
          left: left + 'px',
          margin: 'unset',
          touchAction: 'none',
          ...(isAbsolute && {
            position: 'absolute',
            transform: 'unset',
            width: rectContent.width + 'px',
            height: rectContent.height + 'px'
          }),
          ...(offset.width && { width: offset.width + 'px' }),
          ...(offset.height && { height: offset.height + 'px' })
        }

        this.dragResizeStyle = {
          ...this.dragResizeStyle,
          ...style
        }
      }
      const end = e => {
        // onPointerUp
        e.stopPropagation()
        if (state === STATE_RESIZE) {
          resetBodyCursor && resetBodyCursor()
        }
        // Excute onClickContainer before trigger emitState
        setTimeout(() => {
          this.emitState(e, state, 'end')
        })
        removeListener('move', document, moving)
        removeListener('up', document, end)
      }
      addListener('move', document, moving)
      addListener('up', document, end)
    },
    addDragDown() {
      addListener('down', this.$refs.vfmContent, this.pointerDown)
      this.dragResizeStyle.touchAction = 'none'
    },
    removeDragDown() {
      removeListener('down', this.$refs.vfmContent, this.pointerDown)
    },
    addResizeDown() {
      this.visibility.resize = true
      this.$nextTick(() => {
        addListener('down', this.$refs.vfmResize, this.pointerDown)
      })
    },
    removeResizeDown() {
      removeListener('down', this.$refs.vfmResize, this.pointerDown)
      this.visibility.resize = false
    },
    getResizeOffset(direction, offset, rectContainer, rectContent, isAbsolute) {
      const setOffset = dir => {
        let offsetAxis = offset[dir.axis]
        offsetAxis = this.fitParent ? clamp(dir.min, offsetAxis, dir.max) : offsetAxis
        let edge = clamp(dir.minEdge, dir.getEdge(offsetAxis), dir.maxEdge)
        offsetAxis = dir.getOffsetAxis(edge, isAbsolute)
        return {
          [dir.edgeName]: edge,
          [dir.axis]: offsetAxis
        }
      }

      const getDirectionInfo = (position, edgeName, axis, isPositive) => {
        const rectContentEdge = rectContent[edgeName]
        const positionOffset = rectContainer[position] - rectContent[position]
        const EdgeName = capitalize(edgeName)
        return {
          axis,
          edgeName,
          min: isPositive ? positionOffset : -rectContentEdge,
          max: isPositive ? rectContentEdge : positionOffset,
          minEdge: this[`min${EdgeName}`],
          maxEdge: this[`max${EdgeName}`],
          getEdge: offsetAxis => rectContent[edgeName] - offsetAxis * (isPositive ? 1 : -1),
          getOffsetAxis: (edge, isAbsolute) => {
            const offsetAxis = rectContent[edgeName] - edge
            if (isAbsolute) {
              return isPositive ? offsetAxis : 0
            } else {
              return ((isPositive ? 1 : -1) * offsetAxis) / 2
            }
          }
        }
      }

      const directions = {
        t: ['top', 'height', 'y', true],
        b: ['bottom', 'height', 'y', false],
        l: ['left', 'width', 'x', true],
        r: ['right', 'width', 'x', false]
      }

      let _offset = { x: 0, y: 0 }
      direction.split('').forEach(dir => {
        const directionInfo = getDirectionInfo(...directions[dir])
        _offset = {
          ..._offset,
          ...setOffset(directionInfo)
        }
      })
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

.vfm--touch-none {
  touch-action: none;
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
