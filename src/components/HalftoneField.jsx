import { useEffect, useRef } from 'react'

// A live GLSL halftone: domain-warped fbm noise sampled on a dot grid, so the
// field reads as a flowing, printed "signal" pattern rather than a gradient
// blob. The cursor blooms the dots around it. Raw WebGL (no Three.js) keeps
// this a few KB; it pauses offscreen / in hidden tabs and renders a single
// still frame under prefers-reduced-motion.

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`

const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uMouseAmt;
uniform vec3 uBg;
uniform vec3 uInk;
uniform float uCell;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + 11.7; a *= 0.5; }
  return v;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 id = floor(frag / uCell);
  vec2 center = (id + 0.5) * uCell;
  vec2 uv = center / uRes.y;
  float t = uTime * 0.045;

  // Two layers of domain warping give the slow, liquid flow.
  vec2 q = vec2(fbm(uv * 1.7 + vec2(0.0, t)), fbm(uv * 1.7 + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(uv * 1.3 + 2.4 * q + vec2(1.7, 9.2) + t * 0.7),
                fbm(uv * 1.3 + 2.4 * q + vec2(8.3, 2.8) - t * 0.5));
  float n = fbm(uv * 1.2 + 2.0 * r);

  float v = smoothstep(0.34, 0.72, n);

  // Cursor bloom.
  float d = distance(center, uMouse) / uRes.y;
  v += smoothstep(0.28, 0.0, d) * 0.85 * uMouseAmt;

  // Keep the left (where the copy sits) calmer and fade out toward the bottom.
  float x = center.x / uRes.x;
  v *= mix(0.22, 1.0, smoothstep(0.15, 0.85, x));
  v *= smoothstep(0.0, 0.45, center.y / uRes.y);
  v = clamp(v, 0.0, 1.0);

  float radius = v * uCell * 0.52;
  float dist = length(frag - center);
  float dotMask = 1.0 - smoothstep(radius - 0.9, radius + 0.4, dist);
  dotMask *= step(0.04, v);

  gl_FragColor = vec4(mix(uBg, uInk, dotMask), 1.0);
}
`

function hexToRgb(hex) {
  const h = hex.trim().replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const n = parseInt(full, 16)
  if (Number.isNaN(n)) return [0, 0, 0]
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

function readColors() {
  const s = getComputedStyle(document.documentElement)
  return { bg: hexToRgb(s.getPropertyValue('--bg')), ink: hexToRgb(s.getPropertyValue('--signal')) }
}

function compile(gl, type, src) {
  const sh = gl.createShader(type)
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh)
    return null
  }
  return sh
}

export default function HalftoneField({ className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas?.getContext('webgl', { antialias: false, premultipliedAlpha: false })
    if (!gl) return // No WebGL → the CSS background behind the canvas shows through.

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return
    const prog = gl.createProgram()
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'p')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const u = Object.fromEntries(
      ['uRes', 'uTime', 'uMouse', 'uMouseAmt', 'uBg', 'uInk', 'uCell'].map((k) => [k, gl.getUniformLocation(prog, k)]),
    )

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let colors = readColors()
    const mouse = { x: -1e4, y: -1e4, tx: -1e4, ty: -1e4, amt: 0, tamt: 0 }
    let raf = 0
    let visible = true
    const start = performance.now()

    const resize = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      canvas.width = Math.max(1, Math.floor(w * dpr))
      canvas.height = Math.max(1, Math.floor(h * dpr))
      gl.viewport(0, 0, canvas.width, canvas.height)
      if (reduce) draw(0)
    }

    function draw(time) {
      mouse.x += (mouse.tx - mouse.x) * 0.08
      mouse.y += (mouse.ty - mouse.y) * 0.08
      mouse.amt += (mouse.tamt - mouse.amt) * 0.05
      gl.uniform2f(u.uRes, canvas.width, canvas.height)
      gl.uniform1f(u.uTime, time)
      gl.uniform2f(u.uMouse, mouse.x, mouse.y)
      gl.uniform1f(u.uMouseAmt, mouse.amt)
      gl.uniform3fv(u.uBg, colors.bg)
      gl.uniform3fv(u.uInk, colors.ink)
      gl.uniform1f(u.uCell, Math.round((window.innerWidth < 640 ? 8 : 11) * dpr))
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const loop = () => {
      draw((performance.now() - start) / 1000)
      raf = requestAnimationFrame(loop)
    }
    const play = () => {
      if (!reduce && visible && !document.hidden && !raf) raf = requestAnimationFrame(loop)
    }
    const pause = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.tx = (e.clientX - rect.left) * dpr
      mouse.ty = (rect.bottom - e.clientY) * dpr // GL's y axis points up
      if (mouse.x < -1e3) { mouse.x = mouse.tx; mouse.y = mouse.ty }
      mouse.tamt = 1
    }
    const onLeave = () => { mouse.tamt = 0 }

    // Repaint when the theme flips (.dark on <html>).
    const themeObs = new MutationObserver(() => {
      colors = readColors()
      if (reduce) draw(0)
    })
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      visible ? play() : pause()
    })
    io.observe(canvas)

    const onVis = () => (document.hidden ? pause() : play())
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()
    play()

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      pause()
      io.disconnect()
      ro.disconnect()
      themeObs.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVis)
      // Deliberately no loseContext(): StrictMode remounts reuse this same
      // canvas, and getContext() would hand back the already-lost context.
      gl.deleteProgram(prog)
      gl.deleteBuffer(buf)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className={`block h-full w-full ${className}`} />
}
