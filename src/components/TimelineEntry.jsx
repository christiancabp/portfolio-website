import Reveal from './Reveal'
import { imageUrl } from '../lib/sanity'

/**
 * Shared timeline entry used by both Experience and Education so the two
 * sections mirror each other exactly. Renders a left rail with a node dot,
 * a header (title + optional linked subtitle, location, date range), and a
 * flexible body (bullet highlights or a prose description).
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
      <div className="relative flex gap-5 sm:gap-6">
        {/* Rail + node */}
        <div className="relative flex flex-col items-center">
          <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-surface">
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
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 rounded-full bg-accent"
              />
            )}
          </div>
          {!isLast && (
            <span
              aria-hidden="true"
              className="mt-1 w-px flex-1 bg-border"
            />
          )}
        </div>

        {/* Card */}
        <article className="mb-8 min-w-0 flex-1 rounded-xl border border-border bg-surface p-5 transition-colors hover:border-accent sm:p-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <div className="min-w-0">
              <h3 className="text-base font-semibold tracking-tight text-text sm:text-lg">
                {title}
              </h3>
              {subtitle && (
                <p className="mt-0.5 text-sm text-muted">
                  {subtitleUrl ? (
                    <a
                      href={subtitleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline font-medium text-accent"
                    >
                      {subtitle}
                    </a>
                  ) : (
                    <span className="font-medium text-text">{subtitle}</span>
                  )}
                  {location && (
                    <span className="font-mono text-xs text-muted">
                      {' '}
                      &middot; {location}
                    </span>
                  )}
                </p>
              )}
              {!subtitle && location && (
                <p className="mt-0.5 font-mono text-xs text-muted">{location}</p>
              )}
            </div>
            {dateRange && (
              <p className="shrink-0 font-mono text-xs uppercase tracking-wide text-muted tabular-nums sm:text-right">
                {dateRange}
              </p>
            )}
          </div>

          {children && <div className="mt-4">{children}</div>}
        </article>
      </div>
    </Reveal>
  )
}
