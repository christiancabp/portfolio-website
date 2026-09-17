import { FiExternalLink, FiGithub } from 'react-icons/fi'
import Section from '../components/Section'
import Reveal from '../components/Reveal'
import { useContent } from '../hooks/useContent'
import { projectsFixture } from '../lib/fixtures'
import { PROJECTS } from '../lib/queries'
import { imageUrl } from '../lib/sanity'

export default function Projects() {
  const { data: projects } = useContent(PROJECTS, projectsFixture)
  const items = projects || []

  return (
    <Section id="projects" eyebrow="Selected work" title="Projects">
      {items.length === 0 ? (
        <p className="text-muted">No projects to show yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((project, i) => {
            const cover = imageUrl(project.image, 800)
            const tags = Array.isArray(project.tags) ? project.tags : []

            return (
              <Reveal key={project.title || i} delay={i * 0.06}>
                <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg hover:shadow-accent/5">
                  {cover && (
                    <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-bg">
                      <img
                        src={cover}
                        alt={project.title || ''}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-semibold tracking-tight text-text">
                        {project.title}
                      </h3>
                      {(project.projectLink || project.codeLink) && (
                        <div className="flex shrink-0 items-center gap-1">
                          {project.projectLink && (
                            <a
                              href={project.projectLink}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`${project.title || 'Project'} — live site`}
                              className="rounded-md p-1.5 text-muted transition-colors hover:bg-bg hover:text-accent"
                            >
                              <FiExternalLink size={17} />
                            </a>
                          )}
                          {project.codeLink && (
                            <a
                              href={project.codeLink}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`${project.title || 'Project'} — source code`}
                              className="rounded-md p-1.5 text-muted transition-colors hover:bg-bg hover:text-accent"
                            >
                              <FiGithub size={17} />
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {project.description && (
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
                        {project.description}
                      </p>
                    )}

                    {tags.length > 0 && (
                      <ul className="mt-4 flex flex-wrap gap-1.5 pt-0.5">
                        {tags.map((tag, ti) => (
                          <li
                            key={`${tag}-${ti}`}
                            className="rounded-full border border-border bg-bg px-2.5 py-0.5 text-xs font-medium text-muted"
                          >
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
    </Section>
  )
}
