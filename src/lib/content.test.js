import { describe, it, expect } from 'vitest'
import { pickContent } from './content'

describe('pickContent', () => {
  it('returns sanity data when present', () => {
    expect(pickContent([{ a: 1 }], ['fix'], true)).toEqual([{ a: 1 }])
  })
  it('falls back to fixture when empty array in dev', () => {
    expect(pickContent([], ['fix'], true)).toEqual(['fix'])
  })
  it('falls back to fixture when null in dev', () => {
    expect(pickContent(null, { x: 1 }, true)).toEqual({ x: 1 })
  })
  it('does NOT use fixture in production', () => {
    expect(pickContent([], ['fix'], false)).toEqual([])
  })
})
