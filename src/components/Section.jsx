export default function Section({ id, title, eyebrow, index, children, className = '' }) {
  // Terminal-style section marker: a zero-padded number + `//` comment slash,
  // rendered in mono accent — reads like a source-file section divider.
  const marker = index != null ? String(index).padStart(2, '0') : null

  return (
    <section id={id} className={`mx-auto w-full max-w-5xl scroll-mt-20 px-6 py-20 md:py-28 ${className}`}>
      {(title || eyebrow || marker) && (
        <header className="mb-10">
          {(marker || eyebrow) && (
            <p className="mb-2 flex items-center gap-2 font-mono text-xs tracking-widest text-accent">
              {marker && (
                <span aria-hidden="true">
                  {marker} <span className="text-accent/50">//</span>
                </span>
              )}
              {eyebrow && <span className="uppercase text-muted">{eyebrow}</span>}
            </p>
          )}
          {title && <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>}
        </header>
      )}
      {children}
    </section>
  )
}
