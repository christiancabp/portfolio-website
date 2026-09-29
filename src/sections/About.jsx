import Section from '../components/Section'
import Reveal from '../components/Reveal'
import { useContent } from '../hooks/useContent'
import { aboutsFixture } from '../lib/fixtures'
import { ABOUTS } from '../lib/queries'
import { imageUrl } from '../lib/sanity'

// Highlighter-marker emphasis for key phrases in the statement.
function Mark({ children }) {
  return (
    <span className="relative whitespace-nowrap text-ink">
      <span aria-hidden="true" className="absolute inset-x-[-0.12em] inset-y-[0.08em] -z-10 -skew-x-6 bg-signal" />
      {children}
    </span>
  )
}

export default function About() {
  const { data: abouts } = useContent(ABOUTS, aboutsFixture)
  const items = abouts || []

  return (
    <Section id="about" index={1} eyebrow="Who I am" title="About">
      <Reveal>
        <p className="relative isolate max-w-5xl text-[clamp(1.6rem,3.6vw,3rem)] font-medium leading-[1.15] tracking-tight text-text">
          I&apos;m a full-stack developer who cares about <Mark>the details</Mark>. Clean
          interfaces, performance, and code that stays maintainable. I move comfortably from
          the front-end to the back-end, and I like <Mark>shipping work</Mark> that feels
          considered.
        </p>
      </Reveal>

      {items.length > 0 && (
        <div className="mt-20 grid grid-cols-1 border-t border-border sm:grid-cols-3 sm:divide-x sm:divide-border">
          {items.map((item, i) => {
            const src = imageUrl(item.image, 160)
            return (
              <Reveal key={item.title || i} delay={i * 0.08} className="h-full">
                <article className="group relative h-full overflow-hidden border-b border-border p-6 transition-colors duration-300 hover:bg-signal sm:border-b-0 sm:p-8">
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-xs text-accent transition-colors group-hover:text-ink">
                      /{String(i + 1).padStart(2, '0')}
                    </span>
                    {src && (
                      <img
                        src={src}
                        alt=""
                        aria-hidden="true"
                        width={40}
                        height={40}
                        loading="lazy"
                        className="h-10 w-10 object-contain"
                      />
                    )}
                  </div>
                  <h3 className="display-wide mt-10 text-2xl text-text transition-colors group-hover:text-ink sm:text-[1.7rem]">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="mt-3 text-sm leading-relaxed text-muted transition-colors group-hover:text-ink/80">
                      {item.description}
                    </p>
                  )}
                </article>
              </Reveal>
            )
          })}
        </div>
      )}
    </Section>
  )
}
