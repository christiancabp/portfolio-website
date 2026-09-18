import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'motion/react'
import { FiExternalLink, FiX } from 'react-icons/fi'

// Live-preview modal: embeds a project's deployed site in an iframe so the
// visitor can actually interact with it (play the game, poke the shaders, etc.)
// without leaving the portfolio. Styled as a browser/terminal window to stay
// on-theme with the terminal-editorial aesthetic.
export default function ProjectModal({ project, onClose }) {
  const [loaded, setLoaded] = useState(false)
  const closeRef = useRef(null)

  // Escape closes; body scroll lock while open; focus the close button on mount.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    closeRef.current?.focus()

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  return createPortal(
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-0 backdrop-blur-sm sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        className="relative flex h-[100dvh] w-full max-w-6xl flex-col overflow-hidden border border-border bg-surface shadow-2xl sm:h-[85vh] sm:rounded-xl"
        initial={{ opacity: 0, scale: 0.98, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header — browser/terminal chrome */}
        <div className="flex items-center gap-3 border-b border-border bg-bg px-4 py-2.5">
          {/* Traffic-light dots — subtle window-chrome cue */}
          <div className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
            <span className="h-3 w-3 rounded-full border border-border bg-muted/30" />
            <span className="h-3 w-3 rounded-full border border-border bg-muted/30" />
            <span className="h-3 w-3 rounded-full border border-border bg-muted/30" />
          </div>

          {/* Address-bar pill */}
          <div className="flex-1 truncate rounded-md border border-border bg-surface px-3 py-1 font-mono text-xs text-muted">
            {project.projectLink}
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-1">
            <a
              href={project.projectLink}
              target="_blank"
              rel="noreferrer"
              aria-label="Open in new tab"
              className="rounded-md p-1.5 text-muted transition-colors hover:text-accent"
            >
              <FiExternalLink size={17} />
            </a>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close preview"
              className="rounded-md p-1.5 text-muted transition-colors hover:text-accent"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="relative flex-1 bg-bg">
          <iframe
            src={project.projectLink}
            title={`${project.title} — live preview`}
            className={`h-full w-full border-0 transition-opacity duration-500 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setLoaded(true)}
            allow="fullscreen; autoplay; gamepad; clipboard-write; xr-spatial-tracking"
          />

          {/* Loading state — terminal-style launch line + spinner */}
          {!loaded && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-5 bg-bg">
              <motion.div
                className="h-8 w-8 rounded-full border-2 border-border border-t-accent"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              />
              <p className="font-mono text-xs text-muted sm:text-sm">
                <span className="text-accent">cbermeo:~$</span>{' '}
                launching {project.title}…
                <span className="caret-blink ml-0.5 text-accent">▊</span>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  )
}
