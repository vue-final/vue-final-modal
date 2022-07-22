export function focusAndScrollIntoView(container) {
  if (!container) return
  if (typeof container.focus === 'function') container.focus()
  if (typeof container.scrollIntoView === 'function') container.scrollIntoView()
}
