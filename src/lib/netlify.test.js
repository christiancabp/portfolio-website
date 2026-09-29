import { describe, it, expect } from 'vitest'
import { encode, summarizeFields, diagnoseResponse } from './netlify'

describe('encode', () => {
  it('url-encodes form fields', () => {
    expect(encode({ 'form-name': 'contact', name: 'Ada L', email: 'a@b.co' }))
      .toBe('form-name=contact&name=Ada%20L&email=a%40b.co')
  })
})

describe('summarizeFields', () => {
  it('reports lengths, never values', () => {
    expect(summarizeFields({ name: 'Ada', message: 'secret', 'bot-field': '' }))
      .toEqual({ name: 3, message: 6, 'bot-field': 0 })
  })

  it('tolerates missing input', () => {
    expect(summarizeFields(null)).toEqual({})
  })
})

describe('diagnoseResponse', () => {
  it('flags a missing form on 404', () => {
    expect(diagnoseResponse({ status: 404 })).toMatch(/form detection/i)
  })

  it('flags 405 as static hosting', () => {
    expect(diagnoseResponse({ status: 405 })).toMatch(/static hosting/i)
  })

  it('catches a 200 that is really the SPA shell', () => {
    const r = diagnoseResponse({
      status: 200,
      contentType: 'text/html; charset=UTF-8',
      body: '<!doctype html><div id="root"></div>',
    })
    expect(r).toMatch(/NOT recorded/)
  })

  it('treats a plain 2xx as accepted', () => {
    expect(diagnoseResponse({ status: 200, contentType: 'text/html', body: '<p>Thank you!</p>' }))
      .toBe('Accepted by Netlify Forms.')
  })
})
