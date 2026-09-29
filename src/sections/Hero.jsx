import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { FiArrowDownRight, FiArrowUpRight, FiDownload } from 'react-icons/fi'
import GlitchText from '../components/GlitchText'
import HalftoneField from '../components/HalftoneField'
import ProximityText from '../components/ProximityText'
import { useContent } from '../hooks/useContent'
import { profileFixture } from '../lib/fixtures'
import { imageUrl } from '../lib/sanity'

export const ROLES = ['developer', 'engineer', 'student', 'dad', 'AI enthusiast', 'freelancer', 'future millionaire', 'entrepreneur']

const EASE = [0.16, 1, 0.3, 1]

// Live Eastern-time clock for the hero's meta strip — a small "this is a real
// person, right now" detail.
function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now.toLocaleTimeString('en-US', {
    timeZone: 'America/New_York',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

// Load-in: each block rises out of a clipped line box, staggered.
function Rise({ children, delay = 0, className = '' }) {
  return (
    <span className={`block overflow-hidden ${className}`}>
      <motion.span
        className="block"
        initial={{ y: '110%' }}
        animate={{ y: 0 }}
        transition={{ duration: 1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  )
}

function FadeUp({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

export default function Hero() {
  const { data: profile } = useContent(
    `*[_type == "profile"][0]{..., "resumeUrl": resumePdf.asset->url}`,
    profileFixture,
  )
  const time = useClock()

  // The headline + glitch are hardcoded and must always render (e.g. before any
  // Sanity content exists in production); only profile-derived extras are conditional.
  const p = profile || {}
  const avatar = p.avatar ? imageUrl(p.avatar, 320) : ''

  return (
    <section id="hero" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      {/* Live halftone shader. The radial gradient underneath is the no-WebGL fallback. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(50rem 36rem at 80% 20%, color-mix(in oklab, var(--signal) 22%, transparent), transparent 70%)',
        }}
      >
        <HalftoneField />
      </div>
      {/* Fade the field into the page so the band below sits on solid ground. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-bg to-transparent" />

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 pb-14 pt-28 sm:px-8 sm:pt-32">
        {/* Meta strip */}
        <FadeUp delay={0.1}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted">
            <span>
              <span className="text-accent">[</span> portfolio / {new Date().getFullYear()}{' '}
              <span className="text-accent">]</span>
            </span>
            <span className="tabular-nums">
              <span className="mr-2 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-signal" />
              local time {time} ET
            </span>
          </div>
        </FadeUp>

        <div className="flex flex-1 flex-col justify-center py-12">
          <h1 className="relative">
            <span className="sr-only">
              Hello, I&apos;m Christian Bermeo, your friendly neighborhood developer, engineer,
              student, dad, AI enthusiast, freelancer, future millionaire, and entrepreneur.
            </span>

            <span aria-hidden="true" className="block">
              <Rise delay={0.15} className="mb-2 sm:mb-4">
                <span className="font-mono text-sm text-muted sm:text-base">
                  <span className="text-accent">cbermeo:~$</span> hello, i&apos;m
                </span>
              </Rise>
              <Rise delay={0.25}>
                <ProximityText
                  text="Christian"
                  className="font-display text-[clamp(2rem,calc((100vw-4rem)*0.112),7.75rem)] uppercase leading-[0.86] tracking-[-0.02em] text-text"
                />
              </Rise>
              <Rise delay={0.38}>
                <span className="flex items-end gap-[0.12em] text-[clamp(2rem,calc((100vw-4rem)*0.112),7.75rem)] leading-[0.86]">
                  <ProximityText
                    text="Bermeo"
                    className="font-display uppercase tracking-[-0.02em] text-text"
                  />
                  <span className="mb-[0.1em] inline-block h-[0.62em] w-[0.34em] shrink-0 bg-signal caret-blink" />
                </span>
              </Rise>
            </span>
          </h1>

          <FadeUp delay={0.6} className="mt-8 sm:mt-10">
            <p aria-hidden="true" className="flex flex-wrap items-baseline gap-x-3 text-xl font-medium text-muted sm:text-3xl">
              <span>your friendly neighborhood</span>
              <span className="display-tight whitespace-nowrap text-3xl text-accent sm:text-5xl">
                <GlitchText words={ROLES} />
              </span>
            </p>
          </FadeUp>

          <div className="mt-12 grid items-end gap-8 md:grid-cols-[1fr_auto]">
            {(p.tagline || p.bio) && (
              <FadeUp delay={0.75}>
                <p className="max-w-md border-l-2 border-signal pl-4 text-base leading-relaxed text-text/80 sm:text-lg">
                  {p.tagline || p.bio}
                </p>
              </FadeUp>
            )}

            <FadeUp delay={0.85} className="md:col-start-2">
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#contact"
                  className="group inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3.5 font-mono text-sm font-bold uppercase tracking-wider text-ink shadow-[4px_4px_0_0_var(--text)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_var(--text)]"
                >
                  get in touch
                  <FiArrowDownRight className="transition-transform group-hover:rotate-[-45deg]" />
                </a>
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 rounded-full border border-text/30 bg-bg/40 px-6 py-3.5 font-mono text-sm font-bold uppercase tracking-wider text-text backdrop-blur transition-colors hover:border-text hover:bg-text hover:text-bg"
                >
                  see the work
                </a>
                {p.resumeUrl && (
                  <a
                    href={p.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-2 py-3 font-mono text-xs font-medium uppercase tracking-wider text-muted transition-colors hover:text-accent"
                  >
                    <FiDownload />
                    resume
                    <FiArrowUpRight className="opacity-60" size={13} />
                  </a>
                )}
              </div>
            </FadeUp>
          </div>
        </div>

        {avatar && (
          <motion.img
            src={avatar}
            alt={p.name || 'Profile'}
            width={176}
            height={176}
            loading="eager"
            initial={{ opacity: 0, rotate: 0, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 6, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.9, ease: EASE }}
            className="absolute right-6 top-28 hidden h-36 w-36 border-4 border-bone object-cover shadow-2xl grayscale transition-[filter] duration-500 hover:grayscale-0 md:block lg:right-16 lg:h-44 lg:w-44"
          />
        )}
      </div>
    </section>
  )
}
