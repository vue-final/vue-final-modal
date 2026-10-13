/** jsdom has no dialog methods: these follow the browser closely enough for `<VueFinalDialog>`. */
export function polyfillDialog() {
  Object.assign(HTMLDialogElement.prototype, {
    showModal(this: HTMLDialogElement) {
      if (this.open)
        throw new DOMException('The dialog is already open.', 'InvalidStateError')
      this.open = true
      this.dataset.modal = 'true'
    },
    show(this: HTMLDialogElement) {
      this.open = true
      this.dataset.modal = 'false'
    },
    close(this: HTMLDialogElement, returnValue?: string) {
      if (!this.open)
        return
      this.open = false
      if (returnValue !== undefined)
        this.returnValue = returnValue
      setTimeout(() => this.dispatchEvent(new Event('close')))
    },
  })
}

/** What the browser does on Esc: a cancelable cancel event, then the close. */
export function pressEsc() {
  const dialog = document.querySelector('dialog')!
  if (dialog.dispatchEvent(new Event('cancel', { cancelable: true })))
    dialog.close()
}
