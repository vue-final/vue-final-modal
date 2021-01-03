<template>
  <div
    v-if="ssr || visible"
    v-show="!ssr || visible"
    ref="root"
    :style="bindStyle"
    class="vfm vfm--inset"
    :class="[attach === false ? 'vfm--fixed' : 'vfm--absolute', { 'vfm--prevent-none': preventClick }]"
    @keydown="onEsc"
  >
    <transition
      :name="overlayTransition"
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
        :class="classes"
        :style="styles"
        :aria-expanded="visibility.modal.toString()"
        role="dialog"
        aria-modal="true"
        tabindex="-1"
        @click.self="onClickContainer"
      >
        <div
          ref="vfmContent"
          class="vfm__content"
          :class="[contentClass, { 'vfm--prevent-auto': preventClick }]"
          :style="contentStyle"
        >
          <slot :params="params" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onBeforeUnmount, computed, nextTick, watch, inject } from 'vue'
import FocusTrap from './utils/focusTrap.js'
import { disableBodyScroll, enableBodyScroll } from './utils/bodyScrollLock'

const TransitionState = {
  Enter: 'enter',
  Entering: 'entering',
  Leave: 'leave',
  Leaving: 'leavng'
}

export default {
  name: 'VueFinalModal',
  props: {
    name: { type: String, default: null },
    modelValue: { type: Boolean, default: false },
    ssr: { type: Boolean, default: true },
    classes: { type: [String, Object, Array], default: '' },
    overlayClass: { type: [String, Object, Array], default: '' },
    contentClass: { type: [String, Object, Array], default: '' },
    styles: { type: [String, Object, Array], default: '' },
    overlayStyle: { type: [String, Object, Array], default: '' },
    contentStyle: { type: [String, Object, Array], default: '' },
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
    transition: { type: String, default: 'vfm' },
    overlayTransition: { type: String, default: 'vfm' },
    zIndexAuto: { type: Boolean, default: true },
    zIndexBase: { type: [String, Number], default: 1000 },
    zIndex: { type: [Boolean, String, Number], default: false },
    focusRetain: { type: Boolean, default: true },
    focusTrap: { type: Boolean, default: false }
  },
  emits: ['update:modelValue', 'click-outside', 'before-open', 'opened', 'before-close', 'closed'],
  setup(props, { emit }) {
    const uid = Symbol('vfm')
    const root = ref(null)
    const vfmContent = ref(null)
    const vfmContainer = ref(null)

    const $vfm = inject(props.options.key)

    const modalStackIndex = ref(null)
    const $focusTrap = new FocusTrap()

    const visible = ref(false)
    const visibility = reactive({
      modal: false,
      overlay: false
    })
    const overlayTransitionState = ref(null)
    const modalTransitionState = ref(null)
    const _stopEvent = ref(false)
    const params = ref({})

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
        }
      },
      {
        flush: 'post'
      }
    )

    $vfm.modals.push(getModalInfo())

    onMounted(() => {
      mounted()
    })
    onBeforeUnmount(() => {
      close()
      props.lockScroll && enableBodyScroll(vfmContent)
      root?.value?.remove()

      let index = $vfm.modals.findIndex(vm => vm.uid === uid)
      $vfm.modals.splice(index, 1)
    })
    function getModalInfo() {
      return {
        uid,
        props,
        emit,
        vfmContainer,
        vfmContent,
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
        if (emitEvent('before-open', false)) {
          return
        }

        let target = getAttachElement()
        if (target || props.attach === false) {
          props.attach !== false && target.appendChild(root.value)

          let index = $vfm.openedModals.findIndex(vm => vm.uid === uid)

          if (index !== -1) {
            // if this is already exist in modalStack, delete it
            $vfm.openedModals.splice(index, 1)
          }
          $vfm.openedModals.push(getModalInfo())

          modalStackIndex.value = $vfm.openedModals.length - 1

          handleLockScroll()

          $vfm.openedModals
            .filter(vm => vm.uid !== uid)
            .forEach((vm, index) => {
              if (vm.getAttachElement() === target) {
                // if vm and this have the same attach element
                vm.modalStackIndex.value = index
                vm.visibility.overlay = false
              }
            })

          visible.value = true
          nextTick(() => {
            startTransitionEnter()
          })
        } else if (target !== false) {
          console.warn('Unable to locate target '.concat(props.attach))
        }
      }
    }
    function close() {
      let index = $vfm.openedModals.findIndex(vm => vm.uid === uid)
      if (index !== -1) {
        // remove this in modalStack
        $vfm.openedModals.splice(index, 1)
      }
      if ($vfm.openedModals.length > 0) {
        // If there are still nested modals opened
        const $_vm = $vfm.openedModals[$vfm.openedModals.length - 1]
        $_vm.props.focusTrap && $_vm.$focusTrap.firstElement().focus()
        if ($_vm.props.focusRetain || $_vm.props.focusTrap) {
          $_vm.vfmContainer.value.focus()
        }
        !$_vm.props.hideOverlay && ($_vm.visibility.overlay = true)
      }
      startTransitionLeave()
    }
    function handleLockScroll() {
      if (props.modelValue) {
        if (props.lockScroll) {
          disableBodyScroll(vfmContent, {
            reserveScrollBarGap: true
          })
        } else {
          enableBodyScroll(vfmContent)
        }
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
      if (props.focusTrap) {
        $focusTrap.enable(vfmContainer.value)
      }
      emit('opened', createModalEvent({ type: 'opened' }))
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
      props.lockScroll && enableBodyScroll(vfmContent)

      let stopEvent = false
      const event = createModalEvent({
        type: 'closed',
        stop() {
          stopEvent = true
        }
      })
      emit('closed', event)
      if (stopEvent) return
      params.value = {}
    }
    function onClickContainer() {
      emit('click-outside', createModalEvent({ type: 'click-outside' }))
      props.clickToClose && emit('update:modelValue', false)
    }
    function onEsc(evt) {
      if (evt.keyCode === 27 && visible.value && props.escToClose) {
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
      const value = typeof show === 'boolean' ? show : !props.modelValue
      if (value && arguments.length === 2) {
        params.value = _params
      }
      emit('update:modelValue', value)
    }
    return {
      root,
      vfmContent,
      vfmContainer,
      visible,
      visibility,
      params,
      calculateZIndex,
      bindStyle,
      beforeOverlayEnter,
      afterOverlayEnter,
      beforeOverlayLeave,
      afterOverlayLeave,
      beforeModalEnter,
      afterModalEnter,
      beforeModalLeave,
      afterModalLeave,
      onClickContainer,
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
</style>
