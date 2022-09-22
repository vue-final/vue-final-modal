import type { Component } from 'vue'
import { markRaw } from 'vue'
import { VueFinalModal } from '.'

export interface UseModal<T extends Component> {
  component?: T
  bind?: T['$props']
  // bind?: InstanceType<typeof VueFinalModal>['$props']
  slots?: {
    default?: string | {
      component: any
      bind?: any
      on?: any
    }
  }

}

function useModal<T extends Component>(options: UseModal<T>) {
  return options
}

export function main() {
  useModal({
    component: markRaw(VueFinalModal),
    bind: {

    },
  })
}
