// Stolen from bootstrap vue

// Determine if an element is an HTML element
export const isElement = el => !!(el && el.nodeType === Node.ELEMENT_NODE)

// Set an style property on an element
export const setStyle = (el, prop, value) => {
  if (prop && isElement(el)) {
    el.style[prop] = value
  }
}

// Remove an style property from an element
export const removeStyle = (el, prop) => {
  if (prop && isElement(el)) {
    el.style[prop] = ''
  }
}
