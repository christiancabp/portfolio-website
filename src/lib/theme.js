export function resolveInitialTheme(stored, prefersDark) {
  if (stored === 'dark' || stored === 'light') return stored
  return prefersDark ? 'dark' : 'light'
}
