import { FiSun, FiMoon } from 'react-icons/fi'
import { useTheme } from '../context/ThemeProvider'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="rounded-md border border-border p-2 text-muted transition-colors hover:text-accent"
    >
      {theme === 'dark' ? <FiSun /> : <FiMoon />}
    </button>
  )
}
