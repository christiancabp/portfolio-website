export function encode(data) {
  return Object.keys(data)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`)
    .join('&')
}

/**
 * Loggable shape of a submission: field names → value lengths. Lets the
 * console show exactly what was sent without echoing a visitor's message.
 */
export function summarizeFields(data) {
  return Object.fromEntries(
    Object.entries(data || {}).map(([k, v]) => [k, String(v ?? '').length]),
  )
}

/**
 * Best-guess explanation of a Netlify Forms response, for the console.
 * `body` is the start of the response text.
 */
export function diagnoseResponse({ status, contentType = '', body = '' }) {
  const html = contentType.includes('text/html')
  // The SPA redirect (/* → /index.html) answered instead of Netlify Forms.
  const isAppShell = html && body.includes('id="root"')

  if (status === 404) {
    return 'Netlify has no form named "contact" for this deploy. Enable form detection (Site → Forms) and redeploy, then confirm "contact" is listed under Forms.'
  }
  if (status === 405) {
    return 'POST not allowed: the request reached static hosting, not Netlify Forms. Form detection is likely off, or the form was not in the built HTML.'
  }
  if (status >= 200 && status < 300 && isAppShell) {
    return 'Got the app shell (index.html) back, so the POST was served by the SPA redirect instead of Netlify Forms. The submission was probably NOT recorded.'
  }
  if (status >= 200 && status < 300) return 'Accepted by Netlify Forms.'
  if (status >= 500) return 'Netlify server error. Retry; if it persists, check the Netlify status page and quote the request id.'
  return `Unexpected status ${status}.`
}
