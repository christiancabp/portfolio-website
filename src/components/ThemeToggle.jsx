import { FiSun, FiMoon } from 'react-icons/fi'
import { useTheme } from '../context/ThemeProvider'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition-all hover:rotate-45 hover:border-signal hover:text-accent"
    >
      {theme === 'dark' ? <FiSun /> : <FiMoon />}
    </button>
  )
}
