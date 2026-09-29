import { useEffect, useRef } from 'react'
import { falloff, mix } from '../lib/proximity'

// Anybody's variable axes: letters rest ultra-wide/heavy and compress + thin
// out as the cursor approaches. Compressing (rather than swelling) means a line
// can only get *narrower* under the cursor, so it never overflows the viewport.
const REST = { stretch: 150, weight: 850 }
const PULLED = { stretch: 55, weight: 200 }
const RADIUS = 260
const EASE = 0.18 // per-frame lerp toward the target — lower is lazier

/**
 * Renders `text` as per-letter spans whose width/weight axes react to cursor
 * proximity. Touch devices get a CSS staggered "breathing" wave instead;
 * reduced-motion users get the static rest state.
 */
export default function ProximityText({ text, className = '' }) {
  const root = useRef(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(pointer: fine)').matches
    if (reduce || !fine) return

    const letters = [...el.querySelectorAll('[data-letter]')]
    const state = letters.map(() => ({ t: 0 }))
    const pointer = { x: -9999, y: -9999 }
    let raf = 0

    const tick = () => {
      // Batch all layout reads before any writes to avoid thrashing.
      const targets = letters.map((node) => {
        const r = node.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        return falloff(Math.hypot(pointer.x - cx, pointer.y - cy), RADIUS)
      })
      let moving = false
      letters.forEach((node, i) => {
        const s = state[i]
        s.t += (targets[i] - s.t) * EASE
        if (Math.abs(targets[i] - s.t) > 0.002) moving = true
        node.style.fontStretch = `${mix(REST.stretch, PULLED.stretch, s.t)}%`
        node.style.fontWeight = String(Math.round(mix(REST.weight, PULLED.weight, s.t)))
      })
      raf = moving ? requestAnimationFrame(tick) : 0
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const onMove = (e) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
      kick()
    }
    const onLeave = () => {
      pointer.x = -9999
      pointer.y = -9999
      kick()
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    window.addEventListener('scroll', kick, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('scroll', kick)
      cancelAnimationFrame(raf)
    }
  }, [text])

  return (
    <span ref={root} aria-hidden="true" className={`block whitespace-nowrap ${className}`}>
      {[...text].map((ch, i) => (
        <span
          key={i}
          data-letter
          className="letter-wave-touch inline-block"
          style={{
            fontStretch: `${REST.stretch}%`,
            fontWeight: REST.weight,
            animationDelay: `${i * -0.22}s`,
          }}
        >
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  )
}
