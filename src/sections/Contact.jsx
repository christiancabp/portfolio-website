import { useState } from 'react'
import { FiMail, FiArrowUpRight, FiArrowRight, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import Section from '../components/Section'
import Reveal from '../components/Reveal'
import { useContent } from '../hooks/useContent'
import { profileFixture } from '../lib/fixtures'
import { PROFILE } from '../lib/queries'
import { encode, summarizeFields, diagnoseResponse } from '../lib/netlify'

const EMPTY = { name: '', email: '', message: '' }

// Editorial underline fields: no box, just a rule that turns signal on focus.
const FIELD_CLASSES =
  'w-full border-0 border-b-2 border-border bg-transparent px-0 py-3 text-lg text-text placeholder:text-muted/60 transition-colors focus:border-signal focus:outline-none focus:ring-0 disabled:opacity-60'

const LABEL_CLASSES = 'block font-mono text-xs uppercase tracking-[0.2em] text-muted'

export default function Contact() {
  const { data: profile } = useContent(PROFILE, profileFixture)
  const email = profile?.email

  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error | dev

  const sending = status === 'sending'
  const sent = status === 'sent'

  function update(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (status !== 'idle' && status !== 'sending') setStatus('idle')
  }

  async function onSubmit(e) {
    e.preventDefault()
    // Netlify Forms only exist on Netlify's servers. Vite (and even `netlify
    // dev`) 404 the POST. Say so plainly in dev instead of a misleading error.
    const payload = { 'form-name': 'contact', 'bot-field': '', ...form }
    if (import.meta.env.DEV) {
      console.info('[contact] dev mode, not sent. Field lengths:', summarizeFields(payload))
      setStatus('dev')
      return
    }

    // Diagnostic logging: everything needed to debug a failed submission from
    // the browser console, without echoing what the visitor typed.
    console.groupCollapsed('[contact] submitting to Netlify Forms')
    console.info('POST', `${location.origin}/`, 'fields (lengths):', summarizeFields(payload))
    const started = performance.now()
    setStatus('sending')
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode(payload),
      })
      const contentType = res.headers.get('content-type') || ''
      const body = (await res.text().catch(() => '')).slice(0, 300)
      const info = {
        status: res.status,
        statusText: res.statusText,
        ok: res.ok,
        redirected: res.redirected,
        url: res.url,
        contentType,
        server: res.headers.get('server'),
        // Netlify's request id: quote this to Netlify support.
        requestId: res.headers.get('x-nf-request-id'),
        ms: Math.round(performance.now() - started),
      }
      const diagnosis = diagnoseResponse({ status: res.status, contentType, body })
      console.info('response:', info)
      console.info('body (first 300 chars):', body)
      console.info('diagnosis:', diagnosis)
      console.groupEnd()

      if (!res.ok || diagnosis.includes('NOT recorded')) {
        console.error('[contact] submission failed:', diagnosis, info)
        throw new Error(diagnosis)
      }
      console.info('[contact] submission accepted', { requestId: info.requestId })
      setStatus('sent')
      setForm(EMPTY)
    } catch (err) {
      console.groupEnd()
      console.error('[contact] error:', err)
      setStatus('error')
    }
  }

  return (
    <Section id="contact" index={6} eyebrow="Say hello" title="Get in touch">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <Reveal>
          <div>
            <p className="display-wide text-[clamp(2.2rem,5vw,4.2rem)] leading-[0.92] text-text">
              Got an idea?
              <span className="block text-accent">Let&apos;s make it loud.</span>
            </p>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-muted">
              Have a project in mind, a question, or just want to connect? Drop me a
              line. I read every message and usually reply within a day or two.
            </p>

            {email && (
              <a
                href={`mailto:${email}`}
                className="group mt-10 inline-flex flex-col gap-1"
              >
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                  or email directly
                </span>
                <span className="inline-flex items-center gap-3 text-2xl font-semibold text-text transition-colors group-hover:text-accent sm:text-3xl">
                  <FiMail aria-hidden="true" className="shrink-0 text-accent" />
                  <span className="link-underline">{email}</span>
                  <FiArrowUpRight aria-hidden="true" className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </span>
              </a>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <form
            name="contact"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            onSubmit={onSubmit}
            className="relative border border-border bg-surface p-6 shadow-[10px_10px_0_0_var(--signal)] sm:p-10"
          >
            <input type="hidden" name="form-name" value="contact" />

            {/* Honeypot: hidden from real users, catches bots */}
            <p className="sr-only" aria-hidden="true">
              <label>
                Don&apos;t fill this out if you&apos;re human:
                <input name="bot-field" tabIndex={-1} autoComplete="off" />
              </label>
            </p>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="contact-name"
                  className={LABEL_CLASSES}
                >
                  <span className="text-accent">01</span> / name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={update}
                  required
                  autoComplete="name"
                  placeholder="Ada Lovelace"
                  disabled={sending}
                  className={FIELD_CLASSES}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className={LABEL_CLASSES}
                >
                  <span className="text-accent">02</span> / email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={update}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  disabled={sending}
                  className={FIELD_CLASSES}
                />
              </div>
            </div>

            <div className="mt-8">
              <label
                htmlFor="contact-message"
                className={LABEL_CLASSES}
              >
                <span className="text-accent">03</span> / message
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={form.message}
                onChange={update}
                required
                rows={4}
                placeholder="Tell me a little about what you have in mind…"
                disabled={sending}
                className={`${FIELD_CLASSES} resize-y`}
              />
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-5">
              <button
                type="submit"
                disabled={sending}
                className="group inline-flex items-center gap-3 rounded-full bg-signal px-7 py-4 font-mono text-sm font-bold uppercase tracking-wider text-ink shadow-[4px_4px_0_0_var(--text)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_var(--text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-70"
              >
                {sending ? 'sending…' : 'send it'}
                <FiArrowRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
              </button>

              <div aria-live="polite" className="min-h-[1.25rem] text-sm">
                {sent && (
                  <span className="inline-flex items-center gap-1.5 font-medium text-accent">
                    <FiCheckCircle size={16} aria-hidden="true" />
                    Thanks! Your message is on its way.
                  </span>
                )}
                {status === 'error' && (
                  <span className="inline-flex items-center gap-1.5 font-medium text-red-500 dark:text-red-400">
                    <FiAlertCircle size={16} aria-hidden="true" />
                    Something went wrong. Please try again or email me directly.
                  </span>
                )}
                {status === 'dev' && (
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted">
                    <FiAlertCircle size={14} aria-hidden="true" className="shrink-0 text-accent" />
                    dev mode: Netlify Forms only run on the deployed site. Nothing was sent.
                  </span>
                )}
              </div>
            </div>
          </form>
        </Reveal>
      </div>
    </Section>
  )
}
