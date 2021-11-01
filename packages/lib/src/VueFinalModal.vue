<template>
  <div
    v-if="displayDirective !== 'if' || visible"
    v-show="displayDirective !== 'show' || visible"
    ref="root"
    :style="bindStyle"
    class="vfm vfm--inset"
    :class="[attach === false ? 'vfm--fixed' : 'vfm--absolute', { 'vfm--prevent-none': nonModal }]"
    @keydown.esc="onEsc"
  >
    <transition v-bind="computedOverlayTransition" v-on="overlayListeners">
      <div
        v-if="!hideOverlay && visibility.overlay"
        class="vfm__overlay vfm--overlay vfm--absolute vfm--inset"
        :class="overlayClass"
        :style="overlayStyle"
      ></div>
    </transition>
    <transition v-bind="computedTransition" v-on="modalListeners">
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
          :class="[contentClass, { 'vfm--prevent-auto': nonModal }]"
          :style="bindContentStyle"
          @mousedown="onMousedown(null)"
        >
          <slot :params="params" :close="() => $emit('update:modelValue', false)" />
          <div
            v-if="resizeVisible && visibility.modal"
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
import { useFocusTrap } from './utils/focusTrap.js'
import { useDragResize } from './utils/dragResize.js'
import { disableBodyScroll, enableBodyScroll } from './utils/bodyScrollLock'
import { TransitionState, useTransitionState } from './utils/transitionState'

const noop = () => {}

export default {
  props: {
    name: { type: String, default: null },
    modelValue: { type: Boolean, default: false },
    displayDirective: {
      type: String,
      default: 'show',
      validator(val) {
        return ['if', 'show'].indexOf(val) !== -1
      }
    },
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
    nonModal: { type: Boolean, default: false },
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
    minWidth: { type: [Number, String], default: 0 },
    minHeight: { type: [Number, String], default: 0 },
    maxWidth: { type: [Number, String], default: Infinity },
    maxHeight: { type: [Number, String], default: Infinity }
  },
  emits: [
    'update:modelValue',
    'click-outside',
    'before-open',
    'opened',
    '_before-close',
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
    const $focusTrap = useFocusTrap()

    const visible = ref(false)
    const visibility = reactive({
      modal: false,
      overlay: false
    })

    const { state: overlayTransitionState, listeners: overlayListeners } = useTransitionState()
    const { state: modalTransitionState, listeners: modalListeners } = useTransitionState()

    const _stopEvent = ref(false)
    const params = ref({})

    const { resizeVisible, state, dragResizeStyle, removeDragDown, removeResizeDown } = useDragResize({
      props,
      visible,
      vfmContainer,
      vfmContent,
      vfmResize,
      modalTransitionState,
      onEvent(e) {
        emit(state.value, e)
      }
    })

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
          emit('_before-close', createModalEvent({ type: '_before-close' }))
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

    /**
     * Side effect about modal transtion state update
     */
    watch(modalTransitionState, state => {
      switch (state) {
        case TransitionState.Enter:
          if (props.focusRetain || props.focusTrap) {
            vfmContainer.value.focus()
          }
          props.focusTrap && $focusTrap.enable(vfmContainer.value)

          emit('_opened')
          emit('opened', createModalEvent({ type: 'opened' }))
          resolveToggle('show')
          break
        case TransitionState.Leaving:
          if ($focusTrap.enabled) {
            $focusTrap.disable()
          }
          break
        case TransitionState.Leave:
          modalStackIndex.value = null
          props.lockScroll && enableBodyScroll(vfmContainer.value)

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
          break
      }
    })

    props.api.modals.push(getModalInfo())

    onMounted(() => {
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
          props.attach !== false && target.appendChild(root.value)

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
                vm.visibility.overlay = false
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

        if ($_vm.props.focusTrap) {
          nextTick(() => {
            $_vm.$focusTrap.enable($_vm.vfmContainer.value)
            $_vm.$focusTrap.firstElement.focus()
          })
        }

        if ($_vm.props.focusRetain || $_vm.props.focusTrap) {
          $_vm.vfmContainer.value.focus()
        }
        !$_vm.props.hideOverlay && ($_vm.visibility.overlay = true)
      }
      props.drag && removeDragDown()
      props.resize && removeResizeDown()
      state.value = null

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

    function onMousedown(e) {
      lastMousedownEl.value = e?.target
    }

    function onMouseupContainer() {
      // skip when the lastMousedownEl didn't equal vfmContainer
      if (lastMousedownEl.value !== vfmContainer.value) return
      // skip when state equal 'resize:move'
      if (state.value === 'resize:move') return
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

    return {
      root,
      vfmContainer,
      vfmContent,
      vfmResize,
      vfmOverlayTransition,
      vfmTransition,
      computedOverlayTransition,
      computedTransition,
      overlayListeners,
      modalListeners,
      visible,
      visibility,
      params,
      resizeVisible,
      calculateZIndex,
      bindStyle,
      bindContentStyle,
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
