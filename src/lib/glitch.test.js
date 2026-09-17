import { describe, it, expect } from 'vitest'
import { nextIndex } from './glitch'

describe('nextIndex', () => {
  it('advances to the next role', () => expect(nextIndex(0, 6)).toBe(1))
  it('wraps around at the end', () => expect(nextIndex(5, 6)).toBe(0))
})
