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
        <div className="space-y-14">
          {categories.map((category, ci) => (
            <Reveal key={category} delay={ci * 0.06}>
              <div className="grid gap-5 md:grid-cols-[14rem_1fr] md:gap-10">
                <h3 className="flex items-baseline gap-3 md:flex-col md:gap-1">
                  <span className="display-wide text-2xl text-text sm:text-3xl">{category}</span>
                  <span className="font-mono text-xs text-muted">
                    <span className="text-accent">{String(groups[category].length).padStart(2, '0')}</span> tools
                  </span>
                </h3>
                {/* Tile grid with shared 1px rules: gap-px over a border-colored
                    background draws the grid lines without doubled borders. */}
                <ul className="grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-3 lg:grid-cols-4">
                  {groups[category].map((skill, si) => {
                    const Icon = SKILL_ICONS[skill.name] || FiCode
                    return (
                      <li
                        key={skill.name || si}
                        className="group relative flex h-24 flex-col sm:h-28 justify-between overflow-hidden bg-bg p-4 transition-colors duration-200 hover:bg-signal"
                      >
                        <Icon
                          aria-hidden="true"
                          className="h-6 w-6 text-muted transition-all duration-300 group-hover:-rotate-12 group-hover:scale-125 group-hover:text-ink"
                        />
                        <span className="font-mono text-sm font-medium text-text transition-colors group-hover:text-ink">
                          {skill.name}
                        </span>
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
