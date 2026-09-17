import Section from '../components/Section'
import TimelineEntry from '../components/TimelineEntry'
import { useContent } from '../hooks/useContent'
import { educationFixture } from '../lib/fixtures'
import { EDUCATION } from '../lib/queries'
import { formatDateRange } from '../lib/format'

export default function Education() {
  const { data: education } = useContent(EDUCATION, educationFixture)
  const items = education || []

  // Mirror the Experience layout: "B.S. in Computer Science" reads as the subtitle.
  const degreeLine = (item) =>
    [item.degree, item.field].filter(Boolean).join(' in ')

  return (
    <Section id="education" eyebrow="What I studied" title="Education">
      {items.length === 0 ? (
        <p className="text-muted">No education to show yet.</p>
      ) : (
        <div className="mt-2">
          {items.map((item, i) => (
            <TimelineEntry
              key={`${item.school || ''}-${i}`}
              index={i}
              isLast={i === items.length - 1}
              logo={item.logo}
              title={item.school}
              subtitle={degreeLine(item) || undefined}
              location={item.location}
              dateRange={formatDateRange(item.startDate, item.endDate, false)}
            >
              {item.description && (
                <p className="text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              )}
            </TimelineEntry>
          ))}
        </div>
      )}
    </Section>
  )
}
