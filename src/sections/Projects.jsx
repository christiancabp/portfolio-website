import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { FiArrowUpRight, FiGithub, FiPlay } from 'react-icons/fi'
import Section from '../components/Section'
import Reveal from '../components/Reveal'
import ProjectModal from '../components/ProjectModal'
import { useContent } from '../hooks/useContent'
import { projectsFixture } from '../lib/fixtures'
import { PROJECTS } from '../lib/queries'
import { imageUrl } from '../lib/sanity'

// Asymmetric bento rhythm on a 12-col grid: wide/narrow, narrow/wide, repeat.
// A trailing odd card takes the full row so the grid never ends on a gap.
function spanFor(i, count) {
  if (i === count - 1 && count % 2 === 1) return 'lg:col-span-12'
  return [7, 5, 5, 7][i % 4] === 7 ? 'lg:col-span-7' : 'lg:col-span-5'
}

export default function Projects() {
  const { data: projects } = useContent(PROJECTS, projectsFixture)
  const items = projects || []
  const [selected, setSelected] = useState(null)

  return (
    <Section id="projects" index={3} eyebrow="Selected work" title="Projects">
      {items.length === 0 ? (
        <p className="text-muted">No projects to show yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-14 lg:grid-cols-12">
          {items.map((project, i) => {
            const span = spanFor(i, items.length)
            const full = span === 'lg:col-span-12'
            const cover = imageUrl(project.image, full ? 1600 : 1000)
            const tags = Array.isArray(project.tags) ? project.tags : []
            const previewable = Boolean(project.projectLink)
            const openPreview = previewable ? () => setSelected(project) : undefined

            return (
              <Reveal key={project.title || i} delay={(i % 2) * 0.1} className={span}>
                <article
                  {...(previewable && {
                    role: 'button',
                    tabIndex: 0,
                    onClick: openPreview,
                    onKeyDown: (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        openPreview()
                      }
                    },
                    'aria-label': `Open live preview of ${project.title || 'project'}`,
                    'data-cursor': 'play',
                  })}
                  className="group flex h-full flex-col focus-visible:outline-none"
                >
                  <div
                    className={`relative overflow-hidden border border-border bg-surface transition-[border-color,box-shadow] duration-300 group-hover:border-signal group-hover:shadow-[8px_8px_0_0_var(--signal)] group-focus-visible:border-signal group-focus-visible:shadow-[8px_8px_0_0_var(--signal)] ${
                      full ? 'h-64 sm:h-96 lg:h-[30rem]' : 'h-64 sm:h-80 lg:h-[24rem]'
                    }`}
                  >
                    {cover ? (
                      <img
                        src={cover}
                        alt={project.title || ''}
                        loading="lazy"
                        className="h-full w-full object-cover object-top transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                      />
                    ) : (
                      <div className="display-wide text-outline flex h-full items-center justify-center text-6xl">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                    )}

                    <span className="absolute left-0 top-0 bg-signal px-3 py-1.5 font-mono text-xs font-bold text-ink">
                      P/{String(i + 1).padStart(2, '0')}
                    </span>

                    {/* Visible affordance for keyboard + touch users (the custom cursor covers mouse). */}
                    {previewable && (
                      <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-ink/85 px-3 py-1.5 font-mono text-xs font-medium uppercase tracking-wider text-bone backdrop-blur transition-transform duration-300 group-hover:-translate-y-0.5">
                        <FiPlay size={11} className="shrink-0 text-signal" />
                        live preview
                      </span>
                    )}
                  </div>

                  <div className="mt-5 flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="display-wide text-2xl leading-none text-text sm:text-[2rem]">
                        {project.title}
                      </h3>
                      {(project.projectLink || project.codeLink) && (
                        <div className="flex shrink-0 items-center gap-1">
                          {project.codeLink && (
                            <a
                              href={project.codeLink}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              aria-label={`${project.title || 'Project'} source code`}
                              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-text hover:bg-text hover:text-bg"
                            >
                              <FiGithub size={16} />
                            </a>
                          )}
                          {project.projectLink && (
                            <a
                              href={project.projectLink}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              aria-label={`${project.title || 'Project'} live site`}
                              className="flex h-10 w-10 items-center justify-center rounded-full bg-signal text-ink transition-transform hover:rotate-45"
                            >
                              <FiArrowUpRight size={18} />
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {project.description && (
                      <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-muted">
                        {project.description}
                      </p>
                    )}

                    {tags.length > 0 && (
                      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
                        {tags.map((tag, ti) => (
                          <li key={`${tag}-${ti}`} className="font-mono text-xs lowercase text-text/70">
                            <span className="text-accent">#</span>
                            {tag}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <ProjectModal project={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </Section>
  )
}
