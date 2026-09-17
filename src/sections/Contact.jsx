import { useState } from 'react'
import { FiMail, FiSend, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import Section from '../components/Section'
import Reveal from '../components/Reveal'
import { useContent } from '../hooks/useContent'
import { profileFixture } from '../lib/fixtures'
import { PROFILE } from '../lib/queries'
import { encode } from '../lib/netlify'

const EMPTY = { name: '', email: '', message: '' }

const FIELD_CLASSES =
  'w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-muted/70 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:opacity-60'

export default function Contact() {
  const { data: profile } = useContent(PROFILE, profileFixture)
  const email = profile?.email

  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const sending = status === 'sending'
  const sent = status === 'sent'

  function update(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (status === 'error' || status === 'sent') setStatus('idle')
  }

  async function onSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'contact', 'bot-field': '', ...form }),
      })
      if (!res.ok) throw new Error()
      setStatus('sent')
      setForm(EMPTY)
    } catch {
      setStatus('error')
    }
  }

  return (
    <Section id="contact" eyebrow="Say hello" title="Get in touch">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_1.4fr] lg:gap-16">
        <Reveal>
          <div className="max-w-md">
            <p className="text-lg leading-relaxed text-muted">
              Have a project in mind, a question, or just want to connect? Drop me a
              line — I read every message and usually reply within a day or two.
            </p>

            {email && (
              <a
                href={`mailto:${email}`}
                className="group mt-8 inline-flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-text transition-colors hover:border-accent hover:text-accent"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-bg text-muted transition-colors group-hover:border-accent group-hover:text-accent">
                  <FiMail size={17} aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-xs uppercase tracking-widest text-muted">
                    Email
                  </span>
                  {email}
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
            className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
          >
            <input type="hidden" name="form-name" value="contact" />

            {/* Honeypot: hidden from real users, catches bots */}
            <p className="sr-only" aria-hidden="true">
              <label>
                Don&apos;t fill this out if you&apos;re human:
                <input name="bot-field" tabIndex={-1} autoComplete="off" />
              </label>
            </p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-1.5 block text-sm font-medium text-text"
                >
                  Name
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
                  className="mb-1.5 block text-sm font-medium text-text"
                >
                  Email
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

            <div className="mt-5">
              <label
                htmlFor="contact-message"
                className="mb-1.5 block text-sm font-medium text-text"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={form.message}
                onChange={update}
                required
                rows={5}
                placeholder="Tell me a little about what you have in mind…"
                disabled={sending}
                className={`${FIELD_CLASSES} resize-y`}
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-70"
              >
                <FiSend size={16} aria-hidden="true" />
                {sending ? 'Sending…' : 'Send message'}
              </button>

              <div aria-live="polite" className="min-h-[1.25rem] text-sm">
                {sent && (
                  <span className="inline-flex items-center gap-1.5 font-medium text-accent">
                    <FiCheckCircle size={16} aria-hidden="true" />
                    Thanks — your message is on its way.
                  </span>
                )}
                {status === 'error' && (
                  <span className="inline-flex items-center gap-1.5 font-medium text-red-500 dark:text-red-400">
                    <FiAlertCircle size={16} aria-hidden="true" />
                    Something went wrong. Please try again or email me directly.
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
