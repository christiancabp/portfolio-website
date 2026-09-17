import Section from '../components/Section'
import TimelineEntry from '../components/TimelineEntry'
import { useContent } from '../hooks/useContent'
import { experiencesFixture } from '../lib/fixtures'
import { EXPERIENCES } from '../lib/queries'
import { formatDateRange } from '../lib/format'

export default function Experience() {
  const { data: experiences } = useContent(EXPERIENCES, experiencesFixture)
  const items = experiences || []

  return (
    <Section id="experience" index={2} eyebrow="Where I've worked" title="Experience">
      {items.length === 0 ? (
        <p className="text-muted">No experience to show yet.</p>
      ) : (
        <div className="mt-2">
          {items.map((item, i) => (
            <TimelineEntry
              key={`${item.company || ''}-${item.role || ''}-${i}`}
              index={i}
              isLast={i === items.length - 1}
              logo={item.logo}
              title={item.role}
              subtitle={item.company}
              subtitleUrl={item.companyUrl || undefined}
              location={item.location}
              dateRange={formatDateRange(item.startDate, item.endDate, item.current)}
            >
              {Array.isArray(item.highlights) && item.highlights.length > 0 && (
                <ul className="space-y-2">
                  {item.highlights.map((h, hi) => (
                    <li
                      key={hi}
                      className="flex gap-2.5 text-sm leading-relaxed text-muted"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent"
                      />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}
            </TimelineEntry>
          ))}
        </div>
      )}
    </Section>
  )
}
