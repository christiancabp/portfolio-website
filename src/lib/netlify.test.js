import { describe, it, expect } from 'vitest'
import { encode } from './netlify'

describe('encode', () => {
  it('url-encodes form fields', () => {
    expect(encode({ 'form-name': 'contact', name: 'Ada L', email: 'a@b.co' }))
      .toBe('form-name=contact&name=Ada%20L&email=a%40b.co')
  })
})
