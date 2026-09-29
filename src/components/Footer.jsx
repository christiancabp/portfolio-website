import { FiGithub, FiLinkedin, FiTwitter, FiLink, FiMail, FiArrowUp } from 'react-icons/fi'
import { useContent } from '../hooks/useContent'
import { profileFixture } from '../lib/fixtures'
import { PROFILE } from '../lib/queries'

const PLATFORM_ICONS = {
  github: FiGithub,
  linkedin: FiLinkedin,
  twitter: FiTwitter,
  x: FiTwitter,
}

function iconFor(platform) {
  return PLATFORM_ICONS[(platform || '').toLowerCase()] || FiLink
}

export default function Footer() {
  const { data: profile } = useContent(PROFILE, profileFixture)
  const { name, email, socials } = profile || {}
  const links = Array.isArray(socials) ? socials.filter((s) => s?.url) : []

  return (
    <footer className="relative overflow-hidden border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-5 pt-14 sm:flex-row sm:justify-between sm:px-8">
        <div className="text-center sm:text-left">
          {/* Signature terminal prompt. */}
          <p className="font-mono text-sm text-text">
            <span className="text-accent">cbermeo:~$</span>{' '}
            <span className="text-muted">thanks for visiting</span>
            <span
              aria-hidden="true"
              className="caret-blink ml-0.5 inline-block text-accent"
            >
              _
            </span>
          </p>
          {email && (
            <a
              href={`mailto:${email}`}
              className="mt-2 inline-flex items-center gap-1.5 font-mono text-sm text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
            >
              <FiMail size={14} aria-hidden="true" />
              {email}
            </a>
          )}
        </div>

        <div className="flex items-center gap-2">
          {links.length > 0 && (
            <ul className="flex items-center gap-2">
              {links.map((social, i) => {
                const Icon = iconFor(social.platform)
                const label = social.platform || 'link'
                return (
                  <li key={social.url || i}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-signal hover:bg-signal hover:text-ink"
                    >
                      <Icon size={18} />
                    </a>
                  </li>
                )
              })}
            </ul>
          )}
          <a
            href="#hero"
            className="flex h-11 items-center gap-2 rounded-full border border-border px-4 font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:border-text hover:text-text"
          >
            <FiArrowUp aria-hidden="true" /> top
          </a>
        </div>
      </div>

      {/* Giant wordmark: hollow at rest, floods signal on hover. */}
      <div aria-hidden="true" className="group mx-auto w-full max-w-[100rem] select-none px-3 pt-10">
        <p className="display-wide text-outline text-center text-[min(12.6vw,12.5rem)] leading-[0.8] transition-colors duration-500 group-hover:text-signal">
          CBERMEO
        </p>
      </div>

      <div className="border-t border-border">
        <p className="mx-auto flex w-full max-w-6xl justify-between px-5 py-5 font-mono text-xs tracking-wide text-muted sm:px-8">
          <span>© 2026{name ? ` ${name}` : ''}</span>
          <span>built with react + glsl</span>
        </p>
      </div>
    </footer>
  )
}
