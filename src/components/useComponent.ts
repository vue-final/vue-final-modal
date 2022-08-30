import { h, onUnmounted, render } from 'vue'
import VueFinalModal from './VueFinalModal.vue'

let el: false | HTMLDivElement | undefined
const createElement = () => {
  if (el)
    return el
  return typeof document !== 'undefined' && document.createElement('div')
}

export function useComponent() {
  el = createElement()
  const vNode = h(VueFinalModal, {
    teleportTo: 'body',
  })

  onUnmounted(() => {
    if (el)
      render(null, el)
  })

  if (el)
    render(vNode, el)
}

