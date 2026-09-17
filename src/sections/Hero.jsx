import { FiArrowRight, FiArrowUpRight, FiDownload } from 'react-icons/fi'
import GlitchText from '../components/GlitchText'
import Reveal from '../components/Reveal'
import { useContent } from '../hooks/useContent'
import { profileFixture } from '../lib/fixtures'
import { imageUrl } from '../lib/sanity'

const ROLES = ['developer', 'student', 'dad', 'AI enthusiast', 'freelancer', 'future millionaire']

export default function Hero() {
  const { data: profile } = useContent(
    `*[_type == "profile"][0]{..., "resumeUrl": resumePdf.asset->url}`,
    profileFixture,
  )

  if (!profile) return <section id="hero" className="min-h-[60vh]" />

  const avatar = profile.avatar ? imageUrl(profile.avatar, 240) : ''

  return (
    <section
      id="hero"
      className="relative flex min-h-[calc(100vh-4rem)] scroll-mt-16 items-center overflow-hidden"
    >
      {/* Atmospheric background: a soft accent glow + faint grid, kept subtle for the editorial aesthetic */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          backgroundImage:
            'radial-gradient(60rem 40rem at 75% -10%, color-mix(in oklab, var(--accent) 12%, transparent), transparent 70%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] dark:opacity-25"
        style={{
          backgroundImage:
            'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '3.5rem 3.5rem',
          maskImage: 'radial-gradient(70% 60% at 50% 40%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(70% 60% at 50% 40%, black, transparent)',
        }}
      />

      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-12 px-6 py-24 md:grid-cols-[1fr_auto] md:gap-16 md:py-28">
        <div className="max-w-2xl">
          <Reveal>
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Available for work
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-text sm:text-5xl lg:text-6xl">
              <span className="block">Hello, I'm Christian, your friendly</span>
              <span className="block">neighborhood</span>
              {/* Role gets its own height-locked line: leading-[1.05] on a min-h of one line
                  reserves exactly one line of vertical space, so word-length changes never
                  reflow the copy above or below. whitespace-nowrap keeps each role on one line. */}
              <span className="block min-h-[1.05em] whitespace-nowrap text-accent">
                <GlitchText words={ROLES} />
              </span>
              <span className="sr-only">
                developer, student, dad, ai-enthusiast, freelancer, and future millionaire
              </span>
            </h1>
          </Reveal>

          {(profile.tagline || profile.bio) && (
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                {profile.tagline || profile.bio}
              </p>
            </Reveal>
          )}

          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent-hover"
              >
                Get in touch
                <FiArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface/50 px-5 py-3 text-sm font-semibold text-text backdrop-blur transition-colors hover:border-accent hover:text-accent"
              >
                View projects
              </a>
              {profile.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-2 py-3 text-sm font-semibold text-muted underline-offset-4 transition-colors hover:text-text hover:underline"
                >
                  <FiDownload />
                  Download resume
                  <FiArrowUpRight className="opacity-60" size={14} />
                </a>
              )}
            </div>
          </Reveal>
        </div>

        {avatar && (
          <Reveal delay={0.32} className="order-first md:order-none">
            <div className="relative w-fit">
              <div
                aria-hidden="true"
                className="absolute -inset-3 -z-10 rounded-3xl bg-accent/10 blur-xl"
              />
              <img
                src={avatar}
                alt={profile.name || 'Profile'}
                width={176}
                height={176}
                loading="eager"
                className="h-32 w-32 rounded-2xl border border-border object-cover shadow-sm sm:h-44 sm:w-44"
              />
            </div>
          </Reveal>
        )}
      </div>

      {/* Scroll cue */}
      <a
        href="#about"
        aria-label="Scroll to about"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 text-muted transition-colors hover:text-text md:block"
      >
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-border p-1">
          <span className="h-1.5 w-1 animate-bounce rounded-full bg-muted" />
        </span>
      </a>
    </section>
  )
}
