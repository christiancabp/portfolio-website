import { describe, it, expect } from 'vitest'
import { resolveInitialTheme } from './theme'

describe('resolveInitialTheme', () => {
  it('prefers a stored dark choice', () => {
    expect(resolveInitialTheme('dark', false)).toBe('dark')
  })
  it('prefers a stored light choice even if OS is dark', () => {
    expect(resolveInitialTheme('light', true)).toBe('light')
  })
  it('falls back to OS dark when nothing stored', () => {
    expect(resolveInitialTheme(null, true)).toBe('dark')
  })
  it('falls back to light when nothing stored and OS light', () => {
    expect(resolveInitialTheme(null, false)).toBe('light')
  })
  it('ignores invalid stored values', () => {
    expect(resolveInitialTheme('purple', true)).toBe('dark')
  })
})
