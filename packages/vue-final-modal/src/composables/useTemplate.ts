import type { Component } from 'vue'
import { useSsrVfm, useVfm } from '~/composables/useVfm'
import type { Template, UseTemplate } from '~/types'

export const useTemplate: UseTemplate = <T extends Component>(template: Template<T>, options?: {
  onUnmounted?: () => void
}) => {
  let _template: undefined | ReturnType<UseTemplate>

  async function show() {
    if (!_template) {
      const { useTemplate } = await useSsrVfm()
      _template = useTemplate?.(template, options)
    }
    _template?.show()
  }

  async function hide() {
    if (!_template) {
      const { useTemplate } = useVfm()
      _template = useTemplate?.(template, options)
    }
    _template?.hide()
  }

  return { show, hide }
}
