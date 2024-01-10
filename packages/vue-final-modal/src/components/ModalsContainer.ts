import type { Component } from 'vue-demi'
import { computed, defineComponent, h, onBeforeUnmount } from 'vue-demi'
import type { ModalSlotOptions } from '..'
import { isModalSlotOptions, useVfm } from '~/useApi'
import { isString, objectEntries } from '~/utils'

export const ModalsContainer = defineComponent({
  setup() {
    const { modalsContainers, dynamicModals } = useVfm()

    const uid = Symbol(__DEV__ ? 'ModalsContainer' : '')
    const shouldMount = computed(() => uid === modalsContainers.value?.[0])

    modalsContainers.value.push(uid)
    onBeforeUnmount(() => {
      modalsContainers.value = modalsContainers.value.filter(i => i !== uid)
    })

    function resolvedClosed(index: number) {
      dynamicModals[index]?.resolveClosed?.()
      if (!dynamicModals[index]?.keepAlive)
        dynamicModals.splice(index, 1)
    }

    function resolvedOpened(index: number) {
      dynamicModals[index]?.resolveOpened?.()
    }

    return () => {
      if (shouldMount.value)
        return null
      return dynamicModals.map((modal, index) => {
        if (!modal.component)
          return null
        const slots = objectEntries(modal.slots || {}).reduce((acc, cur) => {
          const slotName = cur[0] as string
          const slot = cur[1] as string | Component | ModalSlotOptions
          if (isString(slot))
            acc[slotName] = () => h('div', { innerHTML: slot })
          else if (isModalSlotOptions(slot))
            acc[slotName] = () => h(slot.component, slot.attrs)
          else
            acc[slotName] = () => h(slot)
          return acc
        }, {} as any)

        return h(modal.component, {
          'key': modal.id,
          'modelValue': modal.modelValue,
          'onUpdate:modelValue': (value: boolean) => modal.modelValue = value,
          'displayDirective': modal?.keepAlive ? 'show' : undefined,
          ...(typeof modal.attrs === 'object' ? modal.attrs : {}),
          'on_closed': () => resolvedClosed(index),
          'on_opened': () => resolvedOpened(index),
        }, slots)
      })
    }
  },
})
