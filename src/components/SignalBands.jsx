import Marquee from './Marquee'

const FRONT = ['React', 'Three.js', 'GLSL shaders', 'Node', 'Python', 'AI agents', 'Web + mobile', 'End to end']
const BACK = ['developer', 'engineer', 'dad', 'AI enthusiast', 'freelancer', 'future millionaire', 'entrepreneur']

// Two crossed, counter-scrolling tickers between the hero and the content —
// the loud "poster tape" moment of the page. overflow-hidden on the wrapper
// contains the rotated bands so they never cause horizontal page scroll.
export default function SignalBands() {
  return (
    <div aria-hidden="true" className="relative overflow-hidden py-10 sm:py-14">
      <div className="absolute inset-x-[-5%] top-1/2 -translate-y-1/2 rotate-[2.5deg] border-y border-border bg-surface py-3 text-muted">
        <Marquee
          items={BACK}
          duration={50}
          reverse
          separator="/"
          className="font-mono text-sm uppercase tracking-[0.3em]"
        />
      </div>
      <div className="relative -mx-[5%] -rotate-[2deg] border-y-2 border-ink bg-signal py-3 text-ink shadow-[0_18px_40px_-20px_rgba(255,79,26,0.7)] sm:py-4">
        <Marquee items={FRONT} duration={32} className="display-wide text-2xl sm:text-4xl" />
      </div>
    </div>
  )
}
