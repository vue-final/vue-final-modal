/** Checked by vue-tsc in the typecheck script: Vitest's type checker cannot read the .vue files these types come from. */
import type { Component } from 'vue'
import type { ModalCloseResult, ModalOpenResult, ModalStatus } from '../index'
import type { ComponentProps } from '../types'
import { computed, defineComponent, reactive, ref } from 'vue'
import { defineModal, useModal, useModalSlot, useVfm } from '../index'
// @ts-expect-error a JavaScript module without types
import Untyped from '../untyped.fixture.js'

const ModalConfirm = defineComponent({
  props: { title: { type: String, required: true }, count: { type: Number, required: true }, note: String },
  emits: { confirm: (_value: number) => true },
  setup: () => () => null,
})
const title = ref('Hello')

export function takesEachRequiredPropFromAttrsOrProps() {
  useModal({ component: ModalConfirm, attrs: { title: 'Hello' }, props: { count: 1 } })
  useModal({ component: ModalConfirm, attrs: { class: 'z-50' }, props: computed(() => ({ title: title.value, count: 1 })) })
  useModal({ component: ModalConfirm, attrs: () => ({ title: title.value, count: 1, onConfirm: (_value: number) => {} }) })
  useModal({ component: ModalConfirm, attrs: { title, count: ref(1) } })
  useModal({ component: ModalConfirm, attrs: reactive({ title: 'Hello', count: 1 }) })
  defineModal({ component: ModalConfirm, attrs: { title }, props: { count: 1 } })
}

export function rejectsARequiredPropGivenNowhere() {
  // @ts-expect-error count is missing
  useModal({ component: ModalConfirm, attrs: { title: 'Hello' } })
  // @ts-expect-error title and count are missing
  useModal({ component: ModalConfirm, attrs: { class: 'z-50' } })
  // @ts-expect-error title and count are missing
  useModal({ component: ModalConfirm })
  // @ts-expect-error count is missing
  defineModal({ component: ModalConfirm, attrs: { title } })
}

export function stillChecksValuesNamesAndListeners() {
  // @ts-expect-error title is a string
  useModal({ component: ModalConfirm, attrs: { title: 1, count: 1 } })
  // @ts-expect-error title is a string
  useModal({ component: ModalConfirm, attrs: { title: ref(1), count: 1 } })
  // @ts-expect-error ModalConfirm has no subtitle prop
  useModal({ component: ModalConfirm, attrs: { title: 'Hello', count: 1, subtitle: 'x' } })
  // @ts-expect-error confirm sends a number
  useModal({ component: ModalConfirm, attrs: { title: 'Hello', count: 1, onConfirm: (_value: string) => {} } })
}

export function keepsTheDefaultVueFinalModalOptional() {
  useModal({})
  useModal({ attrs: { clickToClose: false, contentClass: 'confirm', onClosed: () => {} } })
  useModal({ attrs: { clickToClose: ref(false) }, slots: { default: 'Hello' } })
  // @ts-expect-error clickToClose is a boolean
  useModal({ attrs: { clickToClose: 'no' } })
}

export function keepsPropsOptionalForAnUntypedComponent() {
  useModal({ component: Untyped, attrs: { value: 1 } })
  useModal({ slots: { default: useModalSlot({ component: Untyped, attrs: { value: 1, theme: 'dark' } }) } })
  defineModal({ component: Untyped })
}

export async function typesTheResultsAndTheStatus() {
  const modal = useModal({ component: ModalConfirm, attrs: { title: 'Hello', count: 1 } })
  const opened: ModalOpenResult = await modal.open()
  const closed: ModalCloseResult = await modal.close()
  // @ts-expect-error open() never resolves with closed
  const comparedToClosed = await modal.open() === 'closed'
  const status: ModalStatus = modal.status.value
  // @ts-expect-error the status is read-only
  modal.status.value = 'opened'

  const vfm = useVfm()
  const toggledOpen: undefined | Promise<ModalOpenResult> = vfm.toggle('id', true)
  const toggledClosed: undefined | Promise<ModalCloseResult> = vfm.toggle('id', false)
  // @ts-expect-error toggle(true) resolves with an open result
  const wrongToggle: undefined | Promise<ModalCloseResult> = vfm.toggle('id', true)
  const vfmStatus: ModalStatus | undefined = vfm.get('id')?.value.status.value
  return [opened, closed, comparedToClosed, status, toggledOpen, toggledClosed, wrongToggle, vfmStatus]
}

export function takesAComponentAFunctionIsGenericOver<T extends Component>(component: T, attrs?: ComponentProps<T>) {
  useModal({ defaultModelValue: true, component, attrs })
  useModal({ component, attrs: () => ({ ...attrs }) })
  useModal({ slots: { default: useModalSlot({ component, attrs }) } })
  defineModal({ component, attrs })
}
