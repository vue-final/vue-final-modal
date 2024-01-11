import { disablePageScroll, enablePageScroll, setFillGapMethod } from 'scroll-lock'
import type { Ref } from 'vue'
import { onBeforeUnmount, watch } from 'vue'
import type VueFinalModal from './VueFinalModal.vue'
import { noop, once } from '~/utils'

export function useScrollLock(props: InstanceType<typeof VueFinalModal>['$props'], options: {
  lockScrollEl: Ref<undefined | HTMLElement>
  modelValueLocal: Ref<boolean>
}) {
  const { lockScrollEl, modelValueLocal } = options

  let _lockScrollEl: HTMLElement
  watch(lockScrollEl, (val) => {
    if (val)
      _lockScrollEl = val
  }, { immediate: true })

  watch(() => props.lockScroll, (val) => {
    val ? _disablePageScroll() : _enablePageScroll()
  })

  watch(() => props.reserveScrollBarGap, (val) => {
    setFillGapMethod(val ? 'padding' : 'none')
  }, { immediate: true })

  onBeforeUnmount(() => {
    _enablePageScroll()
  })

  let enablePageScrollOnce = noop
  function _enablePageScroll() {
    enablePageScrollOnce()
  }

  function _disablePageScroll() {
    if (!modelValueLocal.value)
      return
    if (props.lockScroll && _lockScrollEl) {
      disablePageScroll(_lockScrollEl)
      enablePageScrollOnce = once(() => {
        _lockScrollEl && enablePageScroll(_lockScrollEl)
      })
    }
  }

  return {
    enablePageScroll: _enablePageScroll,
    disablePageScroll: _disablePageScroll,
  }
}
