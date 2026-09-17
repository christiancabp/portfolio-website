import { FiGithub, FiLinkedin, FiTwitter, FiLink, FiMail } from 'react-icons/fi'
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
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-6 py-12 sm:flex-row sm:justify-between">
        <div className="text-center sm:text-left">
          {/* Signature terminal prompt — the footer's one flourish. */}
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

        {links.length > 0 && (
          <ul className="flex items-center gap-1">
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
                    className="inline-flex rounded-md p-2 text-muted transition-colors hover:bg-surface hover:text-accent"
                  >
                    <Icon size={18} />
                  </a>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div className="border-t border-border">
        <p className="mx-auto w-full max-w-5xl px-6 py-5 text-center font-mono text-xs tracking-wide text-muted">
          © 2026{name ? ` ${name}` : ''}
        </p>
      </div>
    </footer>
  )
}
