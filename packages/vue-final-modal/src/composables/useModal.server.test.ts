import { describe, expect, it, vi } from 'vitest'
import { useModal } from './useModal'

describe('useModal() on the server', () => {
  it('warns and skips open() outside any app context instead of throwing', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const modal = useModal({ slots: { default: 'Hello World!' } })

    await expect(modal.open()).resolves.toContain('not opened')
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('open() is ignored on the server'))
  })
})
