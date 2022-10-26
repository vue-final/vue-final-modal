<template>
  <div
    v-if="ssr || visible"
    v-show="!ssr || visible"
    ref="root"
    :style="bindStyle"
    class="vfm vfm--inset"
    :class="[attach === false ? 'vfm--fixed' : 'vfm--absolute', { 'vfm--prevent-none': preventClick }]"
    @keydown.esc="onEsc"
  >
    <transition
      v-bind="computedOverlayTransition"
      @before-enter="beforeOverlayEnter"
      @after-enter="afterOverlayEnter"
      @before-leave="beforeOverlayLeave"
      @after-leave="afterOverlayLeave"
    >
      <div
        v-if="!hideOverlay && visibility.overlay"
        class="vfm__overlay vfm--overlay vfm--absolute vfm--inset"
        :class="overlayClass"
        :style="overlayStyle"
      ></div>
    </transition>
    <transition
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
          <slot :params="params" :close="() => $emit('update:modelValue', false)" />
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
/* eslint-disable vue/no-mutating-props */
import { ref, reactive, onMounted, onBeforeUnmount, computed, nextTick, watch } from 'vue'
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
    modelValue: { type: Boolean, default: false },
    ssr: { type: Boolean, default: true },
    classes: { type: [String, Object, Array], default: '' },
    overlayClass: { type: [String, Object, Array], default: '' },
    contentClass: { type: [String, Object, Array], default: '' },
    styles: { type: [Object, Array], default: () => ({}) },
    overlayStyle: { type: [Object, Array], default: () => ({}) },
    contentStyle: { type: [Object, Array], default: () => ({}) },
    lockScroll: { type: Boolean, default: true },
    hideOverlay: { type: Boolean, default: false },
    clickToClose: { type: Boolean, default: true },
    escToClose: { type: Boolean, default: false },
    preventClick: { type: Boolean, default: false },
    attach: {
      type: null,
      default: false,
      validator(val) {
        const type = typeof val

        if (type === 'boolean' || type === 'string') return true

        return val.nodeType === Node.ELEMENT_NODE
      }
    },
    transition: { type: [String, Object], default: 'vfm' },
    overlayTransition: { type: [String, Object], default: 'vfm' },
    keepOverlay: { type: Boolean, default: false },
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
  emits: [
    'update:modelValue',
    'click-outside',
    'before-open',
    'opened',
    'before-close',
    'closed',
    '_before-open',
    '_opened',
    '_closed',
    'drag:start',
    'drag:move',
    'drag:end',
    'resize:start',
    'resize:move',
    'resize:end'
  ],
  setup(props, { emit }) {
    const uid = Symbol('vfm')
    const root = ref(null)
    const vfmContainer = ref(null)
    const vfmContent = ref(null)
    const vfmResize = ref(null)
    const vfmOverlayTransition = ref(null)
    const vfmTransition = ref(null)

    const modalStackIndex = ref(null)
    const $focusTrap = new FocusTrap()

    const visible = ref(false)
    const visibility = reactive({
      modal: false,
      overlay: false,
      resize: false
    })
    const overlayTransitionState = ref(null)
    const modalTransitionState = ref(null)
    const _stopEvent = ref(false)
    const params = ref({})
    const dragResizeStyle = ref({})
    const _state = ref(null)
    const lastMousedownEl = ref(null)

    let resolveToggle = noop
    let rejectToggle = noop

    const computedOverlayTransition = computed(() => {
      if (typeof props.overlayTransition === 'string') return { name: props.overlayTransition }
      return { ...props.overlayTransition }
    })

    const computedTransition = computed(() => {
      if (typeof props.transition === 'string') return { name: props.transition }
      return { ...props.transition }
    })

    const isComponentReadyToBeDestroyed = computed(() => {
      return (
        (props.hideOverlay || overlayTransitionState.value === TransitionState.Leave) &&
        modalTransitionState.value === TransitionState.Leave
      )
    })

    const calculateZIndex = computed(() => {
      if (props.zIndex === false) {
        if (props.zIndexAuto) {
          return +props.zIndexBase + 2 * (modalStackIndex.value || 0)
        } else {
          return false
        }
      } else {
        return props.zIndex
      }
    })

    const bindStyle = computed(() => {
      return {
        ...(calculateZIndex.value !== false && {
          zIndex: calculateZIndex.value
        })
      }
    })

    const bindContentStyle = computed(() => {
      let style = [dragResizeStyle.value]
      Array.isArray(props.contentStyle) ? style.push(...props.contentStyle) : style.push(props.contentStyle)
      return style
    })

    watch(
      () => props.modelValue,
      value => {
        if (_stopEvent.value) {
          _stopEvent.value = false
          return
        }
        mounted()
        if (!value) {
          if (emitEvent('before-close', true)) {
            rejectToggle('hide')
            return
          }
          close()
        }
      }
    )
    watch(() => props.lockScroll, handleLockScroll)
    watch(
      () => props.hideOverlay,
      value => {
        if (props.modelValue && !value) {
          visibility.overlay = true
        }
      }
    )
    watch(() => props.attach, mounted)
    watch(
      isComponentReadyToBeDestroyed,
      val => {
        if (val) {
          visible.value = false
          vfmContainer.value.style.display = 'none'
        }
      },
      {
        flush: 'post'
      }
    )
    watch(
      () => props.drag,
      val => {
        if (visible.value) {
          val ? addDragDown() : removeDragDown()
        }
      }
    )
    watch(
      () => props.resize,
      val => {
        if (visible.value) {
          val ? addResizeDown() : removeResizeDown()
        }
      }
    )
    watch(
      () => props.keepChangedStyle,
      val => {
        if (!val) {
          dragResizeStyle.value = {}
        }
      }
    )

    onMounted(() => {
      props.api.modals.push(getModalInfo())
      mounted()
    })
    onBeforeUnmount(() => {
      close()
      props.lockScroll && vfmContainer.value && enableBodyScroll(vfmContainer.value)
      root?.value?.remove()

      let index = props.api.modals.findIndex(vm => vm.uid === uid)

      props.api.modals.splice(index, 1)
    })
    function getModalInfo() {
      return {
        uid,
        props,
        emit,
        vfmContainer,
        vfmContent,
        vfmResize,
        vfmOverlayTransition,
        vfmTransition,
        getAttachElement,
        modalStackIndex,
        visibility,
        handleLockScroll,
        $focusTrap,
        toggle,
        params
      }
    }
    function mounted() {
      if (props.modelValue) {
        emit('_before-open', createModalEvent({ type: '_before-open' }))
        if (emitEvent('before-open', false)) {
          rejectToggle('show')
          return
        }

        let target = getAttachElement()
        if (target || props.attach === false) {
          if (props.attach !== false) {
            if (root.value) {
              target.appendChild(root.value)
            } else {
              visible.value = true
              nextTick(() => {
                mounted()
              })
              return
            }
          }

          let index = props.api.openedModals.findIndex(vm => vm.uid === uid)

          if (index !== -1) {
            // if this is already exist in modalStack, delete it
            props.api.openedModals.splice(index, 1)
          }
          props.api.openedModals.push(getModalInfo())

          modalStackIndex.value = props.api.openedModals.length - 1

          handleLockScroll()

          props.api.openedModals
            .filter(vm => vm.uid !== uid)
            .forEach((vm, index) => {
              if (vm.getAttachElement() === target) {
                // if vm and this have the same attach element
                vm.modalStackIndex.value = index
                !vm.props.keepOverlay && (vm.visibility.overlay = false)
              }
            })

          visible.value = true
          startTransitionEnter()
        } else if (target !== false) {
          console.warn('Unable to locate target '.concat(props.attach))
        }
      }
    }
    function close() {
      let index = props.api.openedModals.findIndex(vm => vm.uid === uid)
      if (index !== -1) {
        // remove this in modalStack
        props.api.openedModals.splice(index, 1)
      }
      if (props.api.openedModals.length > 0) {
        // If there are still nested modals opened
        const $_vm = props.api.openedModals[props.api.openedModals.length - 1]
        $_vm.props.focusTrap && $_vm.$focusTrap.firstElement().focus()
        if ($_vm.props.focusRetain || $_vm.props.focusTrap) {
          $_vm.vfmContainer.value.focus()
        }
        !$_vm.props.hideOverlay && ($_vm.visibility.overlay = true)
      }
      props.drag && removeDragDown()
      props.resize && removeResizeDown()
      _state.value = null

      startTransitionLeave()
    }
    function handleLockScroll() {
      if (props.modelValue) {
        nextTick(() => {
          if (props.lockScroll) {
            disableBodyScroll(vfmContainer.value, {
              reserveScrollBarGap: true
            })
          } else {
            enableBodyScroll(vfmContainer.value)
          }
        })
      }
    }
    function getAttachElement() {
      let target
      if (props.attach === false) {
        target = false
      } else if (typeof props.attach === 'string') {
        // CSS selector
        if (window) {
          target = window.document.querySelector(props.attach)
        } else {
          target = false
        }
      } else {
        // DOM Element
        target = props.attach
      }
      return target
    }
    function startTransitionEnter() {
      visibility.overlay = true
      visibility.modal = true
    }
    function startTransitionLeave() {
      visibility.overlay = false
      visibility.modal = false
    }

    function beforeOverlayEnter() {
      overlayTransitionState.value = TransitionState.Entering
    }
    function afterOverlayEnter() {
      overlayTransitionState.value = TransitionState.Enter
    }
    function beforeOverlayLeave() {
      overlayTransitionState.value = TransitionState.Leaving
    }
    function afterOverlayLeave() {
      overlayTransitionState.value = TransitionState.Leave
    }
    function beforeModalEnter() {
      modalTransitionState.value = TransitionState.Entering
    }
    function afterModalEnter() {
      modalTransitionState.value = TransitionState.Enter
      if (props.focusRetain || props.focusTrap) {
        vfmContainer.value.focus()
      }
      props.focusTrap && $focusTrap.enable(vfmContainer.value)
      props.drag && addDragDown()
      props.resize && addResizeDown()

      emit('_opened')
      emit('opened', createModalEvent({ type: 'opened' }))
      resolveToggle('show')
    }
    function beforeModalLeave() {
      modalTransitionState.value = TransitionState.Leaving

      if ($focusTrap.enabled()) {
        $focusTrap.disable()
      }
    }
    function afterModalLeave() {
      modalTransitionState.value = TransitionState.Leave
      modalStackIndex.value = null
      props.lockScroll && enableBodyScroll(vfmContainer.value)
      if (!props.keepChangedStyle) {
        dragResizeStyle.value = {}
      }

      let stopEvent = false
      const event = createModalEvent({
        type: 'closed',
        stop() {
          stopEvent = true
        }
      })
      emit('_closed')
      emit('closed', event)
      resolveToggle('hide')
      if (stopEvent) return
      params.value = {}
    }
    function onMousedown(e) {
      lastMousedownEl.value = e?.target
    }
    function onMouseupContainer() {
      // skip when the lastMousedownEl didn't equal vfmContainer
      if (lastMousedownEl.value !== vfmContainer.value) return
      // skip when state equal 'resize:move'
      if (_state.value === 'resize:move') return
      emit('click-outside', createModalEvent({ type: 'click-outside' }))
      props.clickToClose && emit('update:modelValue', false)
    }
    function onEsc() {
      if (visible.value && props.escToClose) {
        emit('update:modelValue', false)
      }
    }
    function createModalEvent(eventProps = {}) {
      return {
        ref: getModalInfo(),
        ...eventProps
      }
    }
    function emitEvent(eventType, value) {
      let stopEvent = false
      const event = createModalEvent({
        type: eventType,
        stop() {
          stopEvent = true
        }
      })
      emit(eventType, event)
      if (stopEvent) {
        _stopEvent.value = true
        nextTick(() => {
          emit('update:modelValue', value)
        })
        return true
      }
      return false
    }
    function emitState(e, state, action) {
      _state.value = `${state}:${action}`
      emit(_state.value, e)
    }
    function toggle(show, _params) {
      return new Promise((resolve, reject) => {
        resolveToggle = res => {
          resolve(res)
          resolveToggle = noop
        }
        rejectToggle = err => {
          reject(err)
          rejectToggle = noop
        }
        const value = typeof show === 'boolean' ? show : !props.modelValue
        if (value && arguments.length === 2) {
          params.value = _params
        }
        emit('update:modelValue', value)
      })
    }
    function pointerDown(e) {
      e.stopPropagation()
      const STATE_RESIZE = 'resize'
      const STATE_DRAG = 'drag'
      const direction = e.target.getAttribute('direction')
      let state
      if (direction) {
        state = STATE_RESIZE
      } else if (validDragElement(e, vfmContent.value, props.dragSelector)) {
        state = STATE_DRAG
      } else {
        return
      }
      emitState(e, state, 'start')
      const down = getPosition(e)
      const rectContainer = vfmContainer.value.getBoundingClientRect()
      const rectContent = vfmContent.value.getBoundingClientRect()
      const isAbsolute = window.getComputedStyle(vfmContent.value).position === 'absolute'
      const position = {
        top: trimPx(dragResizeStyle.value.top),
        left: trimPx(dragResizeStyle.value.left)
      }
      const limit = (() => {
        if (props.fitParent) {
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
        emitState(e, state, 'move')
        const move = getPosition(e)
        let offset = {
          x: move.x - down.x,
          y: move.y - down.y
        }
        if (state === STATE_RESIZE) {
          offset = getResizeOffset(direction, offset, rectContainer, rectContent, isAbsolute)
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
        if (state === STATE_DRAG && props.fitParent) {
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

        dragResizeStyle.value = {
          ...dragResizeStyle.value,
          ...style
        }
      }
      const end = e => {
        // onPointerUp
        e.stopPropagation()
        if (state === STATE_RESIZE) {
          resetBodyCursor && resetBodyCursor()
        }
        // Excute onMouseupContainer before trigger emitState
        setTimeout(() => {
          emitState(e, state, 'end')
        })
        removeListener('move', document, moving)
        removeListener('up', document, end)
      }
      addListener('move', document, moving)
      addListener('up', document, end)
    }
    function addDragDown() {
      addListener('down', vfmContent.value, pointerDown)
      dragResizeStyle.value.touchAction = 'none'
    }
    function removeDragDown() {
      removeListener('down', vfmContent.value, pointerDown)
    }
    function addResizeDown() {
      visibility.resize = true
      nextTick(() => {
        addListener('down', vfmResize.value, pointerDown)
      })
    }
    function removeResizeDown() {
      removeListener('down', vfmResize.value, pointerDown)
      visibility.resize = false
    }
    function getResizeOffset(direction, offset, rectContainer, rectContent, isAbsolute) {
      const setOffset = dir => {
        let offsetAxis = offset[dir.axis]
        offsetAxis = props.fitParent ? clamp(dir.min, offsetAxis, dir.max) : offsetAxis
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
          minEdge: props[`min${EdgeName}`],
          maxEdge: props[`max${EdgeName}`],
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
    return {
      root,
      vfmContainer,
      vfmContent,
      vfmResize,
      vfmOverlayTransition,
      vfmTransition,
      computedOverlayTransition,
      computedTransition,
      visible,
      visibility,
      params,
      calculateZIndex,
      bindStyle,
      bindContentStyle,
      beforeOverlayEnter,
      afterOverlayEnter,
      beforeOverlayLeave,
      afterOverlayLeave,
      beforeModalEnter,
      afterModalEnter,
      beforeModalLeave,
      afterModalLeave,
      onMousedown,
      onMouseupContainer,
      onEsc
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
.vfm-enter-from,
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
