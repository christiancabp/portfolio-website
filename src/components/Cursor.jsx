import { useEffect, useRef, useState } from 'react'

// Custom cursor for fine pointers only: a signal dot that tracks exactly, plus
// a lagging ring that swells over interactive elements. Any element with a
// `data-cursor="label"` attribute turns the ring into a filled badge showing
// that label (e.g. project cards → "play").
export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  const [enabled, setEnabled] = useState(false)
  const [mode, setMode] = useState({ kind: 'idle', label: '' })

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return
    setEnabled(true)
    document.documentElement.classList.add('has-cursor')

    const pos = { x: -100, y: -100, rx: -100, ry: -100 }
    let raf = 0
    let shown = false

    const show = (v) => {
      if (v === shown) return
      shown = v
      dot.current && (dot.current.style.opacity = v ? '1' : '0')
      ring.current && (ring.current.style.opacity = v ? '1' : '0')
    }

    const loop = () => {
      pos.rx += (pos.x - pos.rx) * 0.2
      pos.ry += (pos.y - pos.ry) * 0.2
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
      if (ring.current) ring.current.style.transform = `translate3d(${pos.rx}px, ${pos.ry}px, 0)`
      raf = requestAnimationFrame(loop)
    }

    const onMove = (e) => {
      pos.x = e.clientX
      pos.y = e.clientY
      if (!raf) {
        pos.rx = pos.x
        pos.ry = pos.y
        raf = requestAnimationFrame(loop)
      }
      show(true)
    }

    const onOver = (e) => {
      const t = e.target
      // Iframes swallow pointer events, so the dot would freeze at the edge.
      if (t.tagName === 'IFRAME') return show(false)
      const labelled = t.closest?.('[data-cursor]')
      if (labelled) return setMode({ kind: 'label', label: labelled.dataset.cursor })
      if (t.closest?.('input, textarea')) return setMode({ kind: 'text', label: '' })
      if (t.closest?.('a, button, [role="button"], label, select')) return setMode({ kind: 'hover', label: '' })
      setMode({ kind: 'idle', label: '' })
    }

    const onLeave = () => show(false)
    const onDown = () => ring.current?.classList.add('scale-75')
    const onUp = () => ring.current?.classList.remove('scale-75')

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver)
    document.addEventListener('pointerleave', onLeave)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    return () => {
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
  }, [])

  if (!enabled) return null

  const ringSize =
    mode.kind === 'label' ? 'h-24 w-24 bg-signal border-signal' :
    mode.kind === 'hover' ? 'h-14 w-14 bg-signal/15 border-signal' :
    mode.kind === 'text' ? 'h-0 w-0 border-transparent' :
    'h-9 w-9 border-text/40'

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      <div
        ref={ring}
        className="absolute left-0 top-0 opacity-0 transition-opacity duration-200"
      >
        <div
          className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-all duration-300 ease-out ${ringSize}`}
        >
          {mode.kind === 'label' && (
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-ink">
              {mode.label}
            </span>
          )}
        </div>
      </div>
      <div ref={dot} className="absolute left-0 top-0 opacity-0">
        <div
          className={`h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal transition-transform duration-200 ${
            mode.kind === 'label' || mode.kind === 'text' ? 'scale-0' : ''
          }`}
        />
      </div>
    </div>
  )
}
