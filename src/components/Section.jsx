export default function Section({ id, title, eyebrow, children, className = '' }) {
  return (
    <section id={id} className={`mx-auto w-full max-w-5xl scroll-mt-20 px-6 py-20 md:py-28 ${className}`}>
      {(title || eyebrow) && (
        <header className="mb-10">
          {eyebrow && <p className="mb-2 text-sm font-medium uppercase tracking-widest text-accent">{eyebrow}</p>}
          {title && <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>}
        </header>
      )}
      {children}
    </section>
  )
}
