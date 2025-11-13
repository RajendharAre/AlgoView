import React from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { THEME_MODES } from '../utils/themeUtils'

/**
 * Theme Toggle Component - Allows users to switch between light/dark/system mode
 */
const ThemeToggle = ({ showLabel = false, compact = false }) => {
  const { mode, isDark, toggleTheme, setThemeMode } = useTheme()

  const handleQuickToggle = () => {
    toggleTheme()
  }

  return (
    <div className="flex items-center gap-1">
      {/* Quick Toggle Button */}
      <button
        onClick={handleQuickToggle}
        className={`relative inline-flex items-center justify-center transition-all duration-300 rounded-lg
          ${compact ? 'p-2' : 'p-2'}
          ${
            isDark
              ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400'
              : 'bg-blue-100 hover:bg-blue-200 text-blue-600'
          }
        `}
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        aria-label="Toggle theme"
      >
        <div className="relative w-5 h-5">
          <Sun
            size={20}
            className={`absolute inset-0 transition-all duration-300 ${
              isDark ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
            }`}
          />
          <Moon
            size={20}
            className={`absolute inset-0 transition-all duration-300 ${
              isDark ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
            }`}
          />
        </div>
      </button>

      {/* Label */}
      {showLabel && (
        <span className="text-sm font-medium ml-1">
          {isDark ? 'Dark' : 'Light'}
        </span>
      )}

      {/* Dropdown Menu (Optional - More detailed settings) */}
    </div>
  )
}

export default ThemeToggle
