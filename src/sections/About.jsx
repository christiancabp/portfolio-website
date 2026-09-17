import Section from '../components/Section'
import Reveal from '../components/Reveal'
import { useContent } from '../hooks/useContent'
import { aboutsFixture } from '../lib/fixtures'
import { ABOUTS } from '../lib/queries'
import { imageUrl } from '../lib/sanity'

export default function About() {
  const { data: abouts } = useContent(ABOUTS, aboutsFixture)
  const items = abouts || []

  return (
    <Section id="about" eyebrow="Who I am" title="About">
      <Reveal>
        <p className="max-w-2xl text-lg leading-relaxed text-muted">
          I&apos;m a full-stack developer who cares about the details — clean interfaces,
          performance, and code that stays maintainable. I move comfortably from the
          front-end to the back-end, and I like shipping work that feels considered.
        </p>
      </Reveal>

      {items.length > 0 && (
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {items.map((item, i) => {
            const src = imageUrl(item.image, 160)
            return (
              <Reveal key={item.title || i} delay={i * 0.06}>
                <article className="group h-full rounded-xl border border-border bg-surface p-6 transition-colors hover:border-accent">
                  {src && (
                    <div className="mb-5 flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-border bg-bg">
                      <img
                        src={src}
                        alt=""
                        aria-hidden="true"
                        width={48}
                        height={48}
                        loading="lazy"
                        className="h-8 w-8 object-contain"
                      />
                    </div>
                  )}
                  <h3 className="text-base font-semibold tracking-tight text-text">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="mt-2 text-sm leading-relaxed text-muted">
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
