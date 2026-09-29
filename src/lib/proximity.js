// Pure math for the Hero's cursor-reactive name, kept outside the rAF loop so
// it's unit-testable (same pattern as lib/glitch.js).

/**
 * How strongly a letter reacts to the cursor, from 0 (unaffected) to 1 (fully
 * pulled), given the pointer's distance from the letter's center.
 * A smoothstep falloff: gentle at the edge of the radius, full at the center,
 * with no hard ring where the effect switches on.
 */
export function falloff(distance, radius) {
  if (!(radius > 0) || !Number.isFinite(distance)) return 0
  const t = Math.min(Math.max(1 - distance / radius, 0), 1)
  return t * t * (3 - 2 * t)
}

/** Linear interpolation between two axis values by `t` (0..1). */
export function mix(a, b, t) {
  return a + (b - a) * t
}
