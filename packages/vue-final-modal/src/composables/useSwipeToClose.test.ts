// @vitest-environment jsdom
import type { ComponentProps } from '../types'
import { afterEach, describe, expect, it } from 'vitest'
import { createApp, h, nextTick, ref } from 'vue'
import VueFinalModal from '../components/VueFinalModal.vue'
import { createVfm } from '../index'

const apps: { unmount: () => void }[] = []

function mountSwipeable(props: Partial<ComponentProps<typeof VueFinalModal>>) {
  const show = ref(true)
  const el = document.createElement('div')
  document.body.append(el)
  const app = createApp({
    render: () => h(VueFinalModal, {
      'modelValue': show.value,
      'onUpdate:modelValue': (value: boolean) => (show.value = value),
      'teleportTo': false,
      'focusTrap': false,
      ...props,
    }, () => 'Swipe me'),
  })
  app.use(createVfm()).mount(el)
  apps.push(app)
  return show
}

function select(node: Node) {
  const range = document.createRange()
  range.selectNodeContents(node)
  const selection = document.getSelection()!
  selection.removeAllRanges()
  selection.addRange(range)
}

/** A browser reports the selection while the pointer moves, so a selectionchange follows the mousedown. */
function swipeDown(el: Element, distance: number) {
  const at = (clientY: number) => ({ bubbles: true, button: 0, clientX: 100, clientY })
  el.dispatchEvent(new MouseEvent('mousedown', at(100)))
  document.dispatchEvent(new Event('selectionchange'))
  el.dispatchEvent(new MouseEvent('mousemove', at(100 + distance / 2)))
  el.dispatchEvent(new MouseEvent('mousemove', at(100 + distance)))
  el.dispatchEvent(new MouseEvent('mouseup', at(100 + distance)))
}

afterEach(() => {
  apps.splice(0).forEach(app => app.unmount())
  document.getSelection()?.removeAllRanges()
  document.body.innerHTML = ''
})

describe('useSwipeToClose()', () => {
  it('closes on a swipe when nothing is selected', async () => {
    const show = mountSwipeable({ swipeToClose: 'down' })
    await nextTick()

    swipeDown(document.querySelector('.vfm__content')!, 120)

    expect(show.value).toBe(false)
  })

  it('closes on a swipe while text outside the modal is selected', async () => {
    const page = document.createElement('p')
    page.textContent = 'Page text'
    document.body.append(page)
    const show = mountSwipeable({ swipeToClose: 'down' })
    await nextTick()

    select(page)
    swipeDown(document.querySelector('.vfm__content')!, 120)

    expect(show.value).toBe(false)
  })

  it('closes on a swipe from the banner, which a mouse drag selects without any text', async () => {
    const show = mountSwipeable({ swipeToClose: 'down', showSwipeBanner: true })
    await nextTick()

    const banner = document.querySelector('.vfm-swipe-banner-container')!
    select(banner)
    expect(document.getSelection()!.isCollapsed).toBe(false)
    swipeDown(banner, 120)

    expect(show.value).toBe(false)
  })

  it('keeps the modal while text inside it is selected', async () => {
    const show = mountSwipeable({ swipeToClose: 'down' })
    await nextTick()

    const content = document.querySelector('.vfm__content')!
    select(content)
    swipeDown(content, 120)

    expect(show.value).toBe(true)
  })
})
