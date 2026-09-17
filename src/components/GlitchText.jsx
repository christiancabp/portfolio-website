import { useEffect, useRef, useState } from 'react'
import { nextIndex } from '../lib/glitch'

const GLITCH_CHARS = '!<>-_\\/[]{}—=+*^?#'

export default function GlitchText({ words, interval = 2400, className = '' }) {
  const [html, setHtml] = useState(words[0])
  const idx = useRef(0)
  const raf = useRef(0)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let current = words[0]
    let cancelled = false

    function scrambleTo(next) {
      const length = Math.max(current.length, next.length)
      const queue = []
      for (let i = 0; i < length; i++) {
        const start = Math.floor(Math.random() * 20)
        const end = start + 10 + Math.floor(Math.random() * 20)
        queue.push({ from: current[i] || '', to: next[i] || '', start, end, char: '' })
      }
      let frame = 0
      const run = () => {
        if (cancelled) return
        let out = ''
        let done = 0
        for (const q of queue) {
          if (frame >= q.end) { done++; out += q.to }
          else if (frame >= q.start) {
            if (!q.char || Math.random() < 0.28) {
              q.char = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
            }
            out += `<span class="text-accent/60">${q.char}</span>`
          } else { out += q.from }
        }
        setHtml(out)
        if (done < queue.length) { frame++; raf.current = requestAnimationFrame(run) }
        else { current = next }
      }
      run()
    }

    function cycle() {
      idx.current = nextIndex(idx.current, words.length)
      const next = words[idx.current]
      if (reduce) { setHtml(next); current = next } else { scrambleTo(next) }
    }

    const timer = setInterval(cycle, interval)
    return () => { cancelled = true; clearInterval(timer); cancelAnimationFrame(raf.current) }
  }, [words, interval])

  // Decorative/animated; the accessible sentence lives in the Hero's sr-only copy.
  return <span aria-hidden="true" className={className} dangerouslySetInnerHTML={{ __html: html }} />
}
