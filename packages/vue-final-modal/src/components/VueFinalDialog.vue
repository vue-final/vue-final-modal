<script setup lang="ts">
import type { VfmInternal } from '~/plugin'
import type { ModalComponentEmits } from '~/types'
import { lockScroll, unlockScroll } from '@hunterliu/scroll-lock'
import { computed, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue'
import { useInternalExposed } from '~/composables/useInternalExposed'
import { useLabelIds } from '~/composables/useLabelIds'
import { useModalLifecycle } from '~/composables/useModalLifecycle'
import { vfmResolver } from '~/plugin'
import { vueFinalDialogProps } from '~/types'
import { arrayMoveItemToLast, arrayRemoveItem } from '~/utils'

interface Emits extends ModalComponentEmits {
  /** The native events, declared so useModal() attrs can listen to them. */
  (e: 'cancel', event: Event): void
  (e: 'close', event: Event): void
}

defineOptions({ inheritAttrs: false })
const props = defineProps(vueFinalDialogProps)
const emit = defineEmits<Emits>()
defineSlots<{
  default?: (props: { close: () => void, titleId: string, descriptionId: string }) => void
}>()

const dialogEl = ref<HTMLDialogElement>()
const { titleId, descriptionId, labelledby, describedby, warnIfUnnamed } = useLabelIds(dialogEl, 'VueFinalDialog')

/** useModal() hands keepAlive over as displayDirective for VueFinalModal; a dialog stays mounted either way. */
const attrs = useAttrs()
const dialogAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([name]) => name !== 'displayDirective')))
const { isOpen, reportClosed, status, toggle } = useModalLifecycle(props, emit, { open: show, close: hide })

/** Only vfm.open(modalId), vfm.close(modalId) and closeAll() need a vfm: a dialog works without one. */
const vfm = vfmResolver.resolve() as VfmInternal | undefined
const { modalExposed } = useInternalExposed(props, { overlayVisible: ref(false), status, toggle })

let scrollLocked = false

watch(() => props.lockScroll, lock => lock && isOpen.value ? lockPageScroll() : unlockPageScroll())

onMounted(() => {
  if (vfm)
    arrayMoveItemToLast(vfm.modals, modalExposed)
})

onBeforeUnmount(() => {
  if (vfm) {
    arrayRemoveItem(vfm.modals, modalExposed)
    arrayRemoveItem(vfm.openedModals, modalExposed)
    arrayRemoveItem(vfm._dialogs, dialogEl.value!)
  }
  unlockPageScroll()
})

async function show() {
  const el = dialogEl.value!
  if (vfm)
    arrayMoveItemToLast(vfm.openedModals, modalExposed)
  if (!el.open)
    props.modal ? el.showModal() : el.show()
  if (vfm && props.modal)
    arrayMoveItemToLast(vfm._dialogs, el)
  if (props.lockScroll)
    lockPageScroll()
  warnIfUnnamed()
  await animationsFinished(el)
}

async function hide() {
  const el = dialogEl.value!
  if (vfm)
    arrayRemoveItem(vfm._dialogs, el)
  if (el.open)
    el.close()
  await animationsFinished(el)
  /** Shown again while it was closing. */
  if (isOpen.value)
    return
  if (vfm)
    arrayRemoveItem(vfm.openedModals, modalExposed)
  unlockPageScroll()
}

/** A close request, by Esc or `closedby`: the browser closes the dialog after this event unless a listener or beforeClose prevented it. */
function onCancel(event: Event) {
  /** Also reached by Esc pressed while the focus is outside the dialog, which onKeydownEsc does not see. */
  if (emulatesClosedby('none')) {
    event.preventDefault()
    return
  }
  emit('cancel', event)
  if (event.defaultPrevented)
    return
  isOpen.value = false
  if (isOpen.value)
    event.preventDefault()
}

/** Also fired for a close no cancel asked about first, such as a form with `method="dialog"`. A dialog shown again before this event fired stays open. */
function onClose(event: Event) {
  emit('close', event)
  if (!dialogEl.value?.open)
    reportClosed()
}

function close() {
  isOpen.value = false
}

/** Safari has no `closedby` yet: a modal dialog gets the behavior it asks for from the handlers below. */
function emulatesClosedby(value: 'any' | 'none') {
  return props.modal && props.closedby === value && !('closedBy' in HTMLDialogElement.prototype)
}

/** A canceled Esc keydown makes no close request at all, where a canceled cancel event lets the next Esc through. Esc in a dialog nested in this one is that dialog's. */
function onKeydownEsc(event: KeyboardEvent) {
  if (emulatesClosedby('none') && (event.target as Element).closest('dialog') === dialogEl.value)
    event.preventDefault()
}

let pressedOutside = false

/** Only a press on the `::backdrop` targets the dialog itself outside its box. */
function isOutsideBox(event: MouseEvent) {
  const el = dialogEl.value!
  if (event.target !== el)
    return false
  const box = el.getBoundingClientRect()
  return event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom
}

function onPointerdown(event: MouseEvent) {
  pressedOutside = emulatesClosedby('any') && isOutsideBox(event)
}

/** As for `closedby="any"`, a press that starts and ends outside the box asks the dialog to close through a cancel event. */
function onClick(event: MouseEvent) {
  if (pressedOutside && isOutsideBox(event))
    dialogEl.value!.dispatchEvent(new Event('cancel', { cancelable: true }))
  pressedOutside = false
}

function lockPageScroll() {
  if (scrollLocked)
    return
  scrollLocked = true
  lockScroll(document.body, { reserveScrollBarGap: true })
}

function unlockPageScroll() {
  if (!scrollLocked)
    return
  scrollLocked = false
  unlockScroll(document.body)
}

/**
 * Waits for the transitions and animations of the dialog and its `::backdrop`, such as `@starting-style` ones.
 * `subtree` is what reaches the `::backdrop`; the content's own animations and endless ones are not waited for.
 */
function animationsFinished(el: HTMLDialogElement) {
  const animations = el.getAnimations?.({ subtree: true }).filter((animation) => {
    const effect = animation.effect as KeyframeEffect | null
    return effect?.target === el && effect.getComputedTiming().endTime !== Infinity
  }) ?? []
  return Promise.allSettled(animations.map(animation => animation.finished))
}
</script>

<template>
  <dialog
    ref="dialogEl"
    :aria-labelledby="labelledby"
    :aria-describedby="describedby"
    v-bind="dialogAttrs"
    :closedby="closedby"
    @cancel="onCancel"
    @close="onClose"
    @keydown.esc="onKeydownEsc"
    @pointerdown="onPointerdown"
    @click="onClick"
  >
    <slot :close="close" :title-id="titleId" :description-id="descriptionId" />
  </dialog>
</template>
