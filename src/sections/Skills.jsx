import Section from '../components/Section'
import Reveal from '../components/Reveal'
import { useContent } from '../hooks/useContent'
import { skillsFixture } from '../lib/fixtures'
import { SKILLS } from '../lib/queries'
import { groupByCategory } from '../lib/format'
import {
  SiReact, SiNextdotjs, SiTailwindcss, SiTypescript, SiJavascript, SiHtml5, SiCss,
  SiThreedotjs, SiNodedotjs, SiPython, SiDjango, SiMongodb, SiPostgresql, SiGit, SiDocker, SiRedis,
} from 'react-icons/si'
import { FiDatabase, FiTerminal, FiCode, FiCloud, FiServer, FiRefreshCw } from 'react-icons/fi'

// Fixed, sensible display order; only categories that have skills are rendered.
const CATEGORY_ORDER = ['Frontend', 'Backend', 'Tools', 'Other']

// Monochrome brand icons rendered via currentColor — theme-safe (no black-on-dark
// logos), consistent with the terminal-editorial look, and no image assets to manage.
// Unmapped skills fall back to a generic code glyph.
const SKILL_ICONS = {
  'React': SiReact,
  'Next.js': SiNextdotjs,
  'TailwindCSS': SiTailwindcss,
  'TypeScript': SiTypescript,
  'JavaScript': SiJavascript,
  'HTML': SiHtml5,
  'CSS': SiCss,
  'Three.js': SiThreedotjs,
  'Node.js': SiNodedotjs,
  'Python': SiPython,
  'Django': SiDjango,
  'SQL': FiDatabase,
  'MongoDB': SiMongodb,
  'PostgreSQL': SiPostgresql,
  'Git': SiGit,
  'Docker': SiDocker,
  'OpenClaw': FiTerminal,
  'Claude Code': FiTerminal,
  'Redis': SiRedis,
  'AWS': FiCloud,
  'DevOps': FiServer,
  'CI/CD': FiRefreshCw,
}

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
    <Section id="skills" index={4} eyebrow="What I work with" title="Skills">
      {categories.length === 0 ? (
        <p className="text-muted">No skills to show yet.</p>
      ) : (
        <div className="space-y-10">
          {categories.map((category, ci) => (
            <Reveal key={category} delay={ci * 0.06}>
              <div>
                <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-muted">
                  <span className="text-accent/50">#</span> {category}
                </h3>
                <ul className="flex flex-wrap gap-2.5">
                  {groups[category].map((skill, si) => {
                    const Icon = SKILL_ICONS[skill.name] || FiCode
                    return (
                      <li
                        key={skill.name || si}
                        className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm font-medium text-text transition-colors hover:border-accent"
                      >
                        <Icon
                          aria-hidden="true"
                          className="h-4 w-4 shrink-0 text-muted transition-colors group-hover:text-accent"
                        />
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
