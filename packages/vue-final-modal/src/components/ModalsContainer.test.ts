// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest'
import { createApp, h } from 'vue'
import { createVfm, ModalsContainer, useModal } from '../index'

afterEach(() => {
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

it.each([0, 2])('does not warn about attrs it cannot inherit with %i modals open', async (count) => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  const el = document.createElement('div')
  document.body.append(el)
  const app = createApp({ render: () => h(ModalsContainer, { 'data-v-inspector': 'app.vue:1:1' }) })
  app.use(createVfm()).mount(el)

  for (let i = 0; i < count; i++)
    await useModal({ attrs: { focusTrap: false } }).open()

  expect(warn.mock.calls.map(([message]) => String(message))).not.toContainEqual(expect.stringContaining('Extraneous non-props attributes'))
  app.unmount()
})
