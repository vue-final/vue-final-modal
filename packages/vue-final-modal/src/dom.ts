import { noop } from '~/utils'

export const getPosition = (e: TouchEvent | MouseEvent) => {
  if (e instanceof MouseEvent) {
    const { clientX: x, clientY: y } = e
    return { x, y }
  }
  else {
    const { clientX: x, clientY: y } = e.targetTouches[0]
    return { x, y }
  }
}

export function checkPassiveEventSupport(document: Document) {
  if (!document)
    return false
  let supportsPassive = false
  const optionsBlock = {
    get passive() {
      supportsPassive = true
      return false
    },
  }
  document.addEventListener('x', noop, optionsBlock)
  document.removeEventListener('x', noop)
  return supportsPassive
}
