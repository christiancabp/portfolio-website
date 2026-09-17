import { useState } from 'react'
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

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
        <a
          href="#hero"
          className="text-lg font-bold tracking-tight text-text transition-colors hover:text-accent"
        >
          CB
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted transition-colors hover:text-text"
            >
              {link.label}
            </a>
          ))}
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="rounded-md border border-border p-2 text-muted transition-colors hover:text-text"
          >
            {open ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="w-full border-t border-border bg-bg/95 backdrop-blur md:hidden">
          <div className="mx-auto flex w-full max-w-5xl flex-col px-6 py-4">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-border/60 py-3 text-sm font-medium text-muted transition-colors last:border-none hover:text-text"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
