import { motion } from 'motion/react'

export default function Section({ id, title, eyebrow, index, children, className = '' }) {
  // Oversized hollow index numeral + ultra-wide title. The numeral is a
  // decorative "chapter" mark, so it's hidden from assistive tech.
  const marker = index != null ? String(index).padStart(2, '0') : null

  return (
    <section id={id} className={`mx-auto w-full max-w-6xl scroll-mt-24 px-5 py-24 sm:px-8 md:py-32 ${className}`}>
      {(title || eyebrow || marker) && (
        <header className="mb-14 flex items-end gap-5 border-b border-border pb-6 md:mb-20 md:gap-8">
          {marker && (
            <span
              aria-hidden="true"
              className="display-wide text-outline shrink-0 text-[clamp(3.5rem,11vw,8.5rem)] leading-[0.78]"
            >
              {marker}
            </span>
          )}
          <div className="min-w-0 pb-1">
            {eyebrow && (
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-accent">
                <span aria-hidden="true">/ </span>
                {eyebrow}
              </p>
            )}
            {title && (
              // Mask reveal: the title slides up from behind its own line box.
              <h2 className="overflow-hidden pb-1">
                <motion.span
                  className="display-wide block text-[clamp(1.9rem,5.5vw,4rem)] leading-[0.95]"
                  initial={{ y: '105%' }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  {title}
                </motion.span>
              </h2>
            )}
          </div>
        </header>
      )}
      {children}
    </section>
  )
}
