import { describe, it, expect } from 'vitest'
import { falloff, mix } from './proximity'

describe('falloff', () => {
  it('is 1 at the center and 0 at/after the radius', () => {
    expect(falloff(0, 200)).toBe(1)
    expect(falloff(200, 200)).toBe(0)
    expect(falloff(500, 200)).toBe(0)
  })

  it('is 0.5 at half the radius (smoothstep midpoint)', () => {
    expect(falloff(100, 200)).toBeCloseTo(0.5)
  })

  it('decreases monotonically with distance', () => {
    expect(falloff(50, 200)).toBeGreaterThan(falloff(120, 200))
  })

  it('guards bad input', () => {
    expect(falloff(10, 0)).toBe(0)
    expect(falloff(NaN, 200)).toBe(0)
    expect(falloff(Infinity, 200)).toBe(0)
  })
})

describe('mix', () => {
  it('interpolates between endpoints', () => {
    expect(mix(150, 50, 0)).toBe(150)
    expect(mix(150, 50, 1)).toBe(50)
    expect(mix(150, 50, 0.5)).toBe(100)
  })
})
