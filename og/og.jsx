import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource-variable/instrument-sans'
import '@fontsource-variable/anybody/wdth.css'
import '@fontsource-variable/jetbrains-mono'
import '../src/index.css'
import HalftoneField from '../src/components/HalftoneField'

// 1200x630 share card built from the site's real tokens, fonts and shader so
// the link preview reads as the same object as the page it opens.
function Card() {
  return (
    <div
      id="card"
      className="relative isolate overflow-hidden bg-bg text-text"
      style={{ width: 1200, height: 630 }}
    >
      <div className="absolute inset-0 -z-10">
        <HalftoneField maxDpr={2} />
      </div>

      <div className="flex h-full flex-col px-16 pb-0 pt-12">
        <div className="flex items-center justify-between border-b border-border pb-4 font-mono text-[15px] uppercase tracking-[0.2em] text-muted">
          <span>
            <span className="text-accent">[</span> portfolio / 2026 <span className="text-accent">]</span>
          </span>
          <span className="flex items-center gap-2.5 text-text">
            <span className="inline-block h-2 w-2 rounded-full bg-signal" />
            cbermeo.com
          </span>
        </div>

        <div className="mt-14">
          <p className="mb-3 font-mono text-[22px] text-muted">
            <span className="text-accent">cbermeo:~$</span> hello, i&apos;m
          </p>
          <p className="display-wide text-[112px] leading-[0.86]">Christian</p>
          <p className="display-wide flex items-end gap-4 text-[112px] leading-[0.86]">
            Bermeo
            <span className="mb-[0.1em] inline-block h-[0.62em] w-[0.34em] bg-signal" />
          </p>
          <p className="mt-7 flex items-baseline gap-3 text-[34px] font-medium text-muted">
            your friendly neighborhood
            <span className="display-tight text-[48px] text-accent">developer</span>
          </p>
        </div>
      </div>

      {/* Tape band bleeding off the bottom edge, like the page's SignalBands. */}
      <div className="absolute bottom-5 left-[-4%] right-[-4%] -rotate-[2deg] border-y-2 border-ink bg-signal py-3 text-ink">
        <p className="display-wide whitespace-nowrap text-center text-[26px]">
          React <span className="text-[0.6em]">✺</span> Three.js <span className="text-[0.6em]">✺</span> GLSL
          shaders <span className="text-[0.6em]">✺</span> Node <span className="text-[0.6em]">✺</span> AI agents
        </p>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<Card />)
