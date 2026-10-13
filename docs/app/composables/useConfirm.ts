import { useModal } from 'vue-final-modal'
import ModalAwaitConfirm from '~/components/content/ModalAwaitConfirm.vue'

export function useConfirm() {
  const title = ref('')
  let confirmed = false
  let answer: (confirmed: boolean) => void = () => {}

  const { open, close } = useModal({
    component: ModalAwaitConfirm,
    attrs: {
      title,
      onConfirm() {
        confirmed = true
        close()
      },
      onCancel() {
        close()
      },
      onClosed() {
        answer(confirmed)
      },
    },
  })

  return async function confirm(message: string): Promise<boolean> {
    title.value = message
    confirmed = false
    const answered = new Promise<boolean>(resolve => answer = resolve)
    if (await open() !== 'opened')
      return false
    return answered
  }
}
