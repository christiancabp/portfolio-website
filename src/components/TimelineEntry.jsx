import Reveal from './Reveal'
import { imageUrl } from '../lib/sanity'

/**
 * Shared timeline entry used by both Experience and Education so the two
 * sections mirror each other exactly. An editorial ledger row: a date/location
 * rail on the left (with a square node that floods signal on hover), and the
 * title block + body (bullet highlights or prose) on the right.
 */
export default function TimelineEntry({
  index = 0,
  isLast = false,
  logo,
  title,
  subtitle,
  subtitleUrl,
  location,
  dateRange,
  children,
}) {
  const src = logo ? imageUrl(logo, 96) : ''

  return (
    <Reveal delay={index * 0.08}>
      <article
        className={`group relative grid grid-cols-1 gap-4 border-t py-8 md:grid-cols-[14rem_1fr] md:gap-10 md:py-10 ${
          index === 0 ? 'border-t-transparent pt-2 md:pt-2' : 'border-border'
        } ${isLast ? 'border-b border-b-border' : ''}`}
      >
        {/* Hover sweep: a signal bar grows along the top rule. */}
        <span
          aria-hidden="true"
          className="absolute left-0 top-[-1px] h-[2px] w-0 bg-signal transition-[width] duration-500 ease-out group-hover:w-full"
        />

        {/* Rail */}
        <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-4">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden border border-border bg-surface transition-colors duration-300 group-hover:border-signal group-hover:bg-signal">
            {src ? (
              <img
                src={src}
                alt=""
                aria-hidden="true"
                width={44}
                height={44}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            ) : (
              <span aria-hidden="true" className="font-mono text-xs font-bold text-accent transition-colors group-hover:text-ink">
                {String(index + 1).padStart(2, '0')}
              </span>
            )}
          </div>
          <div className="font-mono text-xs uppercase tracking-wider text-muted">
            {dateRange && <p className="tabular-nums text-text">{dateRange}</p>}
            {location && <p className="mt-1">{location}</p>}
          </div>
        </div>

        {/* Body */}
        <div className="min-w-0">
          <h3 className="display-wide text-xl leading-tight text-text transition-transform duration-500 group-hover:translate-x-2 sm:text-3xl">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-2 text-base">
              {subtitleUrl ? (
                <a
                  href={subtitleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline font-medium text-accent"
                >
                  {subtitle} ↗
                </a>
              ) : (
                <span className="font-medium text-accent">{subtitle}</span>
              )}
            </p>
          )}
          {children && <div className="mt-5 max-w-2xl">{children}</div>}
        </div>
      </article>
    </Reveal>
  )
}
