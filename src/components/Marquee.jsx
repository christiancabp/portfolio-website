// Seamless infinite ticker. Content is rendered twice inside one track and the
// track slides by -50% (see .marquee-track in index.css), so the loop has no
// visible seam. Purely decorative — screen readers skip it.
export default function Marquee({ items, duration = 30, reverse = false, className = '', separator = '✺' }) {
  const row = (copy) => (
    <div className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <span key={`${copy}-${i}`} className="flex items-center">
          <span className="px-6">{item}</span>
          <span className="text-[0.6em] opacity-80">{separator}</span>
        </span>
      ))}
    </div>
  )

  return (
    <div
      aria-hidden="true"
      className={`flex overflow-hidden whitespace-nowrap ${reverse ? 'marquee-reverse' : ''} ${className}`}
    >
      <div className="marquee-track flex w-max" style={{ '--marquee-duration': `${duration}s` }}>
        {row(0)}
        {row(1)}
      </div>
    </div>
  )
}
