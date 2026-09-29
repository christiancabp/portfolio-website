import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { FiMenu, FiX } from 'react-icons/fi'
import ThemeToggle from './ThemeToggle'

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#education', label: 'Education' },
  { href: '#contact', label: 'Contact' },
]

// Tracks which section is currently in the middle band of the viewport so the
// nav can slide its highlight pill to it.
function useActiveSection(ids) {
  const [active, setActive] = useState('')
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id))
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ids])
  return active
}

const IDS = LINKS.map((l) => l.href.slice(1)).concat('hero')

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const active = useActiveSection(IDS)

  return (
    <nav className="fixed inset-x-0 top-3 z-50 px-3 sm:top-5">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between rounded-full border border-border bg-bg/70 pl-5 pr-2 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <a
          href="#hero"
          className="group inline-flex items-baseline font-mono text-base font-semibold tracking-tight text-text"
          aria-label="Home"
        >
          <span className="text-accent transition-transform group-hover:-translate-x-0.5">~/</span>
          <span>cb</span>
          <span aria-hidden="true" className="caret-blink ml-0.5 text-accent">
            _
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          <ul className="flex items-center">
            {LINKS.map((link) => {
              const isActive = active === link.href.slice(1)
              return (
                <li key={link.href} className="relative">
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-signal"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <a
                    href={link.href}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative block rounded-full px-3.5 py-2 font-mono text-[0.8rem] font-medium lowercase transition-colors ${
                      isActive ? 'text-ink' : 'text-muted hover:text-text'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-1.5 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-signal text-ink"
          >
            {open ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-2 w-full max-w-6xl overflow-hidden rounded-3xl border border-border bg-bg/95 backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col p-3">
              {LINKS.map((link, i) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-3 rounded-2xl px-4 py-3 text-text transition-colors hover:bg-signal hover:text-ink"
                  >
                    <span className="font-mono text-xs text-accent">0{i + 1}</span>
                    <span className="display-wide text-2xl">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
