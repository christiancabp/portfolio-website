import Section from '../components/Section'
import Reveal from '../components/Reveal'
import { useContent } from '../hooks/useContent'
import { skillsFixture } from '../lib/fixtures'
import { SKILLS } from '../lib/queries'
import { imageUrl } from '../lib/sanity'
import { groupByCategory } from '../lib/format'

// Fixed, sensible display order; only categories that have skills are rendered.
const CATEGORY_ORDER = ['Frontend', 'Backend', 'Tools', 'Other']

export default function Skills() {
  const { data: skills } = useContent(SKILLS, skillsFixture)
  const groups = groupByCategory(skills || [])

  // Preserve the fixed order first, then append any unexpected categories.
  const categories = [
    ...CATEGORY_ORDER.filter((c) => groups[c]?.length),
    ...Object.keys(groups).filter(
      (c) => !CATEGORY_ORDER.includes(c) && groups[c]?.length,
    ),
  ]

  return (
    <Section id="skills" eyebrow="What I work with" title="Skills">
      {categories.length === 0 ? (
        <p className="text-muted">No skills to show yet.</p>
      ) : (
        <div className="space-y-10">
          {categories.map((category, ci) => (
            <Reveal key={category} delay={ci * 0.06}>
              <div>
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">
                  {category}
                </h3>
                <ul className="flex flex-wrap gap-2.5">
                  {groups[category].map((skill, si) => {
                    const icon = imageUrl(skill.icon, 48)
                    return (
                      <li
                        key={skill.name || si}
                        className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm font-medium text-text transition-colors hover:border-accent"
                      >
                        {icon && (
                          <img
                            src={icon}
                            alt=""
                            aria-hidden="true"
                            width={20}
                            height={20}
                            loading="lazy"
                            className="h-5 w-5 shrink-0 object-contain"
                          />
                        )}
                        {skill.name}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </Section>
  )
}
