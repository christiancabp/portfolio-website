import { describe, it, expect } from 'vitest'
import { groupByCategory, formatDateRange } from './format'

describe('groupByCategory', () => {
  it('groups skills by category preserving order', () => {
    const skills = [
      { name: 'React', category: 'Frontend' },
      { name: 'Node', category: 'Backend' },
      { name: 'CSS', category: 'Frontend' },
    ]
    expect(groupByCategory(skills)).toEqual({
      Frontend: [{ name: 'React', category: 'Frontend' }, { name: 'CSS', category: 'Frontend' }],
      Backend: [{ name: 'Node', category: 'Backend' }],
    })
  })
  it('buckets missing category under Other', () => {
    expect(groupByCategory([{ name: 'x' }])).toEqual({ Other: [{ name: 'x' }] })
  })
})

describe('formatDateRange', () => {
  it('formats a closed range', () => {
    expect(formatDateRange('2021-06-01', '2023-02-01', false)).toBe('Jun 2021 — Feb 2023')
  })
  it('shows Present when current', () => {
    expect(formatDateRange('2023-03-01', null, true)).toBe('Mar 2023 — Present')
  })
  it('does not crash on a missing start date (renders the end only)', () => {
    expect(formatDateRange(null, '2026-05-01', false)).toBe('May 2026')
  })
  it('does not crash when both dates are missing', () => {
    expect(formatDateRange(undefined, undefined, false)).toBe('')
  })
})
